# Braincize

AI-powered brain atrophy detection. Next.js 15 (App Router) · TypeScript · Tailwind CSS v4.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Environment

All configuration lives in `.env.local` (copy `.env.example`, which lists every variable with its default).
It is read in one place, `src/config/env.ts`. Restart `next dev` after changing it.

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:3001` | Backend origin (the gateway in `backend/gateway`) |
| `NEXT_PUBLIC_SOCKET_URL` | the API origin | Websocket origin for live results |
| `NEXT_PUBLIC_API_TIMEOUT_MS` | `30000` | Per-request timeout, uploads included |
| `NEXT_PUBLIC_API_MOCK` | `false` | `true` runs without a backend, with canned responses |
| `NEXT_PUBLIC_UPLOAD_BATCH_SIZE` | `10` | Files per upload request; bigger sets are split |
| `NEXT_PUBLIC_SCAN_POLL_MS` | `5000` | Safety-net refresh of a running scan |
| `NEXT_PUBLIC_FRAME_INTERVALS` | `0.5,1,2,5` | Seconds-between-frames choices for video |
| `NEXT_PUBLIC_DEFAULT_FRAME_INTERVAL` | `1` | Preselected choice |
| `NEXT_PUBLIC_MAX_FRAMES` | `60` | Most frames taken from one video |
| `NEXT_PUBLIC_MAX_FRAME_WIDTH` | `1280` | Wider frames are scaled down before upload |

## API layer (`src/lib/api`)

Components never call `fetch`. They use `import { api } from "@/lib/api"`.

- `config.ts` base URL, timeout and mock switch (from `src/config/env.ts`)
- `endpoints.ts` **every route in one file**
- `http.ts` the transport (JSON, FormData, auth header, timeouts); swap the adapter to change it
- `mock.ts` stand-in responses for `NEXT_PUBLIC_API_MOCK=true`
- `services/*.service.ts` one file per domain (auth, catalog, scan, contact, newsletter, faq, research)

`src/lib/realtime` follows an uploaded batch over the backend's websocket (`scanTracker.ts`), with a
mock twin for mock mode. The public FAQ and research lists fall back to the copy in `src/content` if the
backend can't be reached, so those pages still build and render.

## App flow

`/login` → `/dashboard` → `/dashboard/<category>` (e.g. `brainscan`).

- The dashboard lists the backend's **categories**; a category with no models is shown as "Coming soon".
- A category page lists its **models**, takes images (or a video, cut into JPEG frames in the browser by
  `src/lib/video/extractFrames.ts`), and sends them to the chosen model. The file types offered come from the
  model's `accepts`; video is only offered when the model takes JPEG.
- Upload is split into groups of `NEXT_PUBLIC_UPLOAD_BATCH_SIZE`. The backend answers once they are queued,
  then each result arrives over the websocket and fills in its row.

Projects, models and their descriptions are no longer in this repo: add or change them in the backend
(see `backend/gateway/README.md`, "Models and categories"). `/dashboard/**` is gated by `src/middleware.ts`
using the session cookie.

## Styling conventions

- Layouts are authored against the Figma frames: **1440px desktop, 390px mobile**.
- Sizes are `rem` arbitrary values (`w-[23.625rem]` = 378px at 1440). From 1024px up, the root
  font-size follows the viewport (`clamp(12px, 100vw/90, 16px)` in `globals.css`), so desktop scales
  proportionally and is exact at 1440. Below 1024px the mobile layout runs at a 16px root.
- Design tokens (colours, fonts, dashboard palette) live in `@theme` in `globals.css`.
- Copy lives in `src/content/*`, site-wide constants in `src/config/site.ts`.
