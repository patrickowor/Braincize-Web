# Braincize gateway

Express service that sits between the frontend and the two Python scripts in `backend/`
(`brain.py`, `braincize.py`). It handles sign-in, takes a batch of images, queues them on RabbitMQ,
calls the Python endpoints one image at a time, and pushes each result to the browser over a
websocket. **The Python files are not modified or wrapped in-process**; they are called over HTTP
exactly as the frontend called them before.

```
browser ──POST /scans (multipart)──▶ API ──save images──▶ disk
   ▲                                  │  └─ batch record ─▶ Redis (TTL)
   │                                  └─ 1 message / image ▶ RabbitMQ  scan.images
   │ websocket                                                  │
   │ scan:item / scan:batch                                     ▼
   └──────── API ◀── Redis pub/sub ◀──────────────────────── worker ──POST raw bytes──▶ brain.py / braincize.py
```

- **API** (`src/server.ts`): auth, uploads, job lookup, websocket relay.
- **Worker** (`src/worker.ts`): consumes the queue, calls Python, records results, deletes the image. Run as many as you like.

## Run it

Needs Node 22.5+, Redis, RabbitMQ, and the two Python services running.

```bash
cd backend/gateway
cp .env.example .env        # set JWT_SECRET, ADMIN_EMAILS
npm install
npm run seed:models         # once: registers the Python endpoints in the database
npm run dev                 # API + worker with reload
# or: npm run build && npm run start:api && npm run start:worker
npm test
```

Python side: `brain.py` hardcodes `http://127.0.0.1:8002/ismri`, so start `braincize.py` on port **8002**
(its `__main__` block uses 5000; that only matters if you run it directly). The two base URLs are in `.env`
and are read only by `seed:models`.

## HTTP API

Errors are always `{ "message": "...", "details"?: ... }`. Authenticated routes need `Authorization: Bearer <token>`.

| Route | Notes |
|---|---|
| `POST /auth/signup` `{firstName,lastName,email,password}` | 201 `{token,user}`; 409 if the email exists |
| `POST /auth/login` `{username,password}` | `username` is the email. 200 `{token,user}` |
| `POST /auth/logout` | 204; the token stops working immediately |
| `GET /auth/me` | `{id,name,email}` |
| `POST /scans` | multipart: `model` + `images` (repeat the field). 202 with the batch. JPEG/PNG only (checked by bytes) |
| `GET /scans` | the caller's batches (no items) |
| `GET /scans/:id` | batch with every item and result; use it after a reload or dropped socket |
| `GET /faq`, `GET /research`, `GET /research/:id` | public |
| `POST /contact`, `POST /newsletter/subscribe` | public, `{ok:true}` |

`model` is the id of a model in the registry (below). Files are checked by content against that model's `accepts`.

### Models and categories

Which endpoints exist is data in the database, not code. A **model** says where to send a file and how; a
**category** (`brainscan`, `lungscan`, ...) groups models and is what the frontend's project picker lists.
Everything is loaded from the database when a request or job needs it, so changes apply without a restart.

| Route | Who | Notes |
|---|---|---|
| `GET /categories` | signed in | `[{id,name,description,icon,inputLabel,position,modelCount}]` |
| `GET /categories/:id` | signed in | the category plus its `models` |
| `GET /categories/:id/models` | signed in | models of one category, in order |
| `GET /models[?category=id]`, `GET /models/:id` | signed in | users get `{id,name,version,type,description,categoryId,accepts,position}` only |
| `POST /categories`, `PATCH`/`DELETE /categories/:id` | admin | delete is refused (409) while it still has models |
| `PUT /categories/:id/models` `{modelIds:[...]}` | admin | makes that the whole list, in that order; models left out become uncategorised |
| `POST /models`, `PATCH`/`DELETE /models/:id` | admin | `PATCH` changes only the fields sent, e.g. `{"categoryId":"lungscan"}` moves a model |

Admins are the users whose email is in `ADMIN_EMAILS`; `GET /auth/me` returns `isAdmin`. They see full model
records (url, headers, disabled and internal models); everyone else sees the short form above.

Registering a model (`POST /models`):

```json
{
  "id": "lung-ct",                 // slug; required
  "name": "Lung CT",               // required
  "url": "https://host/predict",   // required, http or https
  "categoryId": "lungscan",
  "version": "Version 1", "type": "ResNet", "description": "...",
  "bodyMode": "raw",               // "raw": file bytes are the whole body (what the Python scripts expect)
                                   // "multipart": a form with the file under `fileField` (default "file")
  "accepts": ["image/jpeg", "image/png"],   // checked against the file's real content
  "headers": { "X-Api-Key": "..." },        // sent on every call; admins only
  "insecureTls": false,            // accept a self-signed certificate
  "timeoutMs": 120000,             // overrides PYTHON_TIMEOUT_MS
  "enabled": true,                 // false hides it from users and stops queued jobs for it
  "internal": false,               // true: not listed or runnable by users (used by other services)
  "responses": [{ "when": "...", "example": { "message": "..." } }]   // documentation for admins
}
```

The one thing a model must do is answer with a JSON object that has a string `message`. Every field
(`value`, ...) is passed through to the client as `item.result`. `accepts` can only name types the gateway can
verify (`SUPPORTED_FILE_TYPES` in `src/storage/files.ts`: JPEG and PNG today).

### Seeding the Python endpoints

`npm run seed:models` registers the endpoints found in `brain.py` and `braincize.py`, with the answers each
can give (read from the scripts, `src/registry/pythonModels.ts`), under a `brainscan` category, plus an empty
`lungscan` category and `/ismri` as an internal model.

```bash
npm run seed:models -- --dry-run   # print the endpoints and their responses, change nothing
npm run seed:models                # add what is missing; never touches existing entries
npm run seed:models -- --force     # reset existing entries to the script's values
```

| model | category | calls |
|---|---|---|
| `detect-atrophy` | brainscan | `brain.py` `/predictmid/` |
| `measure-atrophy-v1` | brainscan | `brain.py` `/predictsz/` |
| `measure-atrophy-yolo` | brainscan | `braincize.py` `/predictyolo` |
| `is-mri` (internal) | none | `braincize.py` `/ismri` |

## Websocket

```ts
const socket = io(API_URL, { auth: { token } });          // socket.io; same JWT as the HTTP API
socket.on("scan:item",  ({ batchId, item, done, total }) => ...); // item.status: processing | complete | error
socket.on("scan:batch", ({ batchId, status, done, total }) => ...); // every image finished
```

Each user only receives their own events. `item.result` is Python's `{message, value}` untouched, so the
frontend's `interpretScan` keeps working as is. `item.error` is set only when no answer could be obtained
(service unreachable after retries, image gone). Items come back in upload order with an `index`.

## Retention

Everything tied to a job expires after `JOB_TTL_HOURS` (default 48): the Redis batch and result keys,
the queued messages, and any image still on disk. Images are normally deleted the moment they are
analysed; the worker's sweeper only catches ones orphaned by a crash.

## Swapping pieces

Each piece sits behind a small interface, so changing it means one new file and one line where it is created.

| To replace | Implement | Wire it in |
|---|---|---|
| SQLite (users, models, categories, contact, newsletter, FAQ, research) | `Database` in `src/db/types.ts` | `src/db/index.ts` |
| Redis job store | `JobStore` in `src/jobs/store.ts` | `server.ts`, `worker.ts` |
| Disk uploads (e.g. S3) | `FileStorage` in `src/storage/files.ts` | `server.ts`, `worker.ts` |
| RabbitMQ | `ScanQueue` in `src/queue/queue.ts` | `server.ts`, `worker.ts` |

SQLite schema changes go in the `MIGRATIONS` array in `src/db/sqlite.ts` (append only).
FAQ and research are seeded once from the frontend's content files, then live in the database.

## Notes

- `PYTHON_INSECURE_TLS=true` is applied by `seed:models` to https models (brain.py uses a self-signed cert); each model has its own `insecureTls` flag, which only affects calls to that model.
- `PYTHON_CONCURRENCY` is how many images are in flight per worker (the frontend used 4).
- The Redis and RabbitMQ adapters are covered by tests against `ioredis-mock` and by interface, not against live servers.
