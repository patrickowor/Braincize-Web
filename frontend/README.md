# Braincize

AI-powered brain atrophy detection. Next.js 15 (App Router) · TypeScript · Tailwind CSS v4.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Environment

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | `https://braincize.net` | Backend origin |
| `NEXT_PUBLIC_API_MOCK` | on (anything but `"false"`) | Serve responses from the in-memory mock adapter |

Set `NEXT_PUBLIC_API_MOCK=false` to talk to the real backend.

## API layer (`src/lib/api`)

Components never call `fetch`. They use `import { api } from "@/lib/api"`.

- `config.ts` base URL and mock switch
- `endpoints.ts` **every route in one file**
- `http.ts` the transport (JSON, FormData, raw binary, auth header, timeouts); swap the adapter to change it
- `mock.ts` stand-in responses; delete an entry when its real endpoint exists
- `services/*.service.ts` one file per domain (auth, contact, newsletter, faq, research, scan)

Only the scan endpoints (`/predictmid/`, `/predictsz/`, `/predictyolo`) are confirmed against a live
backend. Auth, contact, newsletter, FAQ and research are placeholders until their contracts exist.

## App flow

`/login` → `/dashboard` (pick a project) → `/dashboard/brainscan` (pick a model, upload images or a
video, analyse). Video is cut into JPEG frames in the browser (`src/lib/video/extractFrames.ts`) and
each frame is sent like any other image. `/dashboard/**` is gated by `src/middleware.ts` using a
session cookie; sessions are mocked until the auth API exists.

Add a project in `src/content/projects.ts`; add or edit models in `src/content/scanModels.ts`
(plus their route in `endpoints.ts`).

## Styling conventions

- Layouts are authored against the Figma frames: **1440px desktop, 390px mobile**.
- Sizes are `rem` arbitrary values (`w-[23.625rem]` = 378px at 1440). From 1024px up, the root
  font-size follows the viewport (`clamp(12px, 100vw/90, 16px)` in `globals.css`), so desktop scales
  proportionally and is exact at 1440. Below 1024px the mobile layout runs at a 16px root.
- Design tokens (colours, fonts, dashboard palette) live in `@theme` in `globals.css`.
- Copy lives in `src/content/*`, site-wide constants in `src/config/site.ts`.
