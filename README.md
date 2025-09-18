## Sample Finder Frontend (Next.js 14)

Modern React/Next.js frontend for the Sample Finder app. It lets you:

- Record a short audio clip in the browser and send it to the backend for song identification
- Display the identified song (title, artist, cover art)
- Show samples scraped from WhoSampled for the identified track
- Connect to Spotify (OAuth) and show profile/top tracks via the backend

---

### Tech Stack
- **Framework**: Next.js 14 (App Router), React 18, TypeScript
- **Styling/UI**: Tailwind CSS, Radix UI, shadcn/ui components
- **Charts/Icons**: Recharts, lucide-react

---

### Requirements
- Node.js 18.17+ or 20+
- npm (or pnpm/yarn)
- The backend running locally at `http://localhost:8000` (default in this project)

---

### Quick Start (Development)
```bash
cd sample-finder-frontend
npm install
npm run dev
```

Then open `http://localhost:3000`.

Notes:
- Microphone access is required to record audio; your browser will prompt for permission.
- The app expects the backend on `http://localhost:8000`. If your backend runs elsewhere, see “Configuring Backend URL”.

---

### Production Build
```bash
npm run build
npm run start
```

By default, Next.js serves on port 3000; use `PORT=...` to change.

---

### Configuring Backend URL
Endpoints are currently hardcoded to `http://localhost:8000` in a few places:

- `app/services/musicApi.ts`: music identify and samples endpoints
- `app/components/layout.tsx`: Spotify login and login-check endpoints
- `app/components/user-profile.tsx`: Spotify profile endpoint

If you deploy or run the backend on a different origin, update those URLs accordingly.

Optional improvement: centralize the base URL via an environment variable. For example, add to `.env.local`:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

And refactor API calls to use `process.env.NEXT_PUBLIC_BACKEND_URL`.

---

### Features Overview
- Record audio in-browser using the MediaRecorder API (hook: `useAudioRecorder`)
- Send audio to backend for Shazam identification (`POST /music/`)
- Fetch samples from WhoSampled via backend (`GET /music/scrape-samples/`)
- Spotify connect button triggers backend OAuth login, stores session cookie, and fetches profile/top tracks

---

### Key Commands
- **Dev**: `npm run dev`
- **Build**: `npm run build`
- **Start**: `npm run start`
- **Lint**: `npm run lint`

---

### App Structure (selected)
```text
sample-finder-frontend/
  app/
    components/
      layout.tsx           # Top navigation + Spotify connect
      music-analyzer.tsx   # Record + analyze flow
      samples-grid.tsx     # Grid of identified samples
      song-dashboard.tsx   # Song details page
      user-profile.tsx     # Spotify profile/top tracks
    contexts/SongContext.tsx
    hooks/useAudioRecorder.ts
    services/musicApi.ts   # Calls the backend (identify + samples)
    song-dashboard/page.tsx
    page.tsx               # Main entry with tabs
    types/music.ts         # Frontend types
  next.config.mjs
  tailwind.config.ts
```

---

### How It Works (End-to-End)
1) Click the record button in the Analyzer. The app records ~5 seconds of audio using `MediaRecorder`.
2) On stop, the recorded `Blob` is posted to the backend `POST /music/` endpoint.
3) The backend responds with `{ song, artist, img_url }` from Shazam.
4) The frontend then calls `GET /music/scrape-samples/?song_title=...&artist=...` and renders the results.
5) Spotify connect starts at `/spotify/login` (backend), which eventually redirects to the frontend. The session cookie is used for subsequent calls like `/spotify/profile`.

---

### Spotify Integration Notes
- The connect button in `layout.tsx` redirects to `http://localhost:8000/spotify/login`.
- Login state is checked via `GET /spotify/check-login` (with `credentials: "include"`).
- The profile is fetched via `GET /spotify/profile` (also with `credentials: "include"`).
- Ensure the backend is configured with a valid `SESSION_SECRET_KEY` and Spotify credentials. See the backend README for details.

---

### Troubleshooting
- Microphone permission denied
  - Ensure you accepted the browser permission prompt. Reload the page and try again.
  - Some browsers require a user gesture (button click) to start recording; the UI already uses a button.

- Requests to backend fail (CORS or Network errors)
  - Confirm the backend is running at `http://localhost:8000` and CORS allows `http://localhost:3000`.
  - If using a different backend origin, update the hardcoded URLs or use an env var.

- Spotify shows as not connected
  - The backend must be running with valid Spotify credentials.
  - Cookies must be included: fetch calls for check/profile include `credentials: "include"`.

---

### License
Add a license for distribution and usage.


