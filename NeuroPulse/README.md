# NeuroPulse

A premium dark-mode React + TypeScript dashboard for a Student Mental Health Predictor, styled with Deep Slate, Midnight, warm Espresso undertones, and restrained violet/ice-blue accents. It connects to an existing FastAPI backend (`POST /predict`) and shows the real score returned by your trained model. Nothing is simulated.

> The score is a model-generated estimate, not a diagnosis. Its clinical meaning is not established.

## Features
- Dashboard, New Prediction, Results, History, and About pages
- 12-field form grouped into Profile, Social Media Habits, and Lifestyle & Well-being, with Zod validation matching `main.py`
- Animated score, red–amber–green gauge and moving needle (0–10 display scale is visualization only; the API does not define a range)
- Local history (localStorage) with delete, clear, and a trend chart built from your own predictions
- Handling for offline API, timeouts, HTTP 422 (mapped to fields), and server errors; duplicate-submit prevention; inputs preserved on failure
- Live API status indicator, responsive desktop sidebar/mobile navigation, animated page transitions, ambient orbit visual, staggered metric cards, keyboard focus states, reduced-motion support

## Requirements
Node.js 18+ and your existing backend (Python, FastAPI, uvicorn).

## Run it
**Terminal 1: backend** (folder containing `main.py` and `Mental_health_Model.pkl`; unchanged):
```bash
uvicorn main:app --reload --port 8000
```
**Terminal 2: frontend:**
```bash
cd neuropulse
npm install
npm run dev
```
Open http://localhost:5173. The header badge shows "API connected" when the backend is reachable.

## How the connection works
The app calls `/api/predict`. `vite.config.ts` proxies `/api/*` to `http://127.0.0.1:8000/*` (stripping `/api`), so no CORS setup is needed in development. If your backend runs elsewhere, edit `target` in `vite.config.ts`.

## Architecture
```
src/
  api.ts         API client (fetch, timeout, typed errors); no UI code
  schema.ts      Zod schema + allowed values mirroring the Pydantic model
  history.ts     localStorage persistence
  components/    Layout, Gauge, AnimatedNumber, ErrorBanner, EmptyState, Disclaimer
  pages/         Dashboard, Predict, Results, History, About, NotFound
```

## Deployment
1. `npm run build` outputs static files to `dist/`.
2. Host `dist/` (Vercel, Netlify, etc.) with an SPA fallback to `index.html`.
3. Host the FastAPI backend and set `VITE_API_BASE_URL` (see `.env.example`) at build time.
4. In production there is no Vite proxy, so add FastAPI's `CORSMiddleware` allowing your frontend origin. This is the only backend change, and only for deployment.

## Troubleshooting
- **"API offline" / network error:** confirm uvicorn is running on port 8000 and run `uvicorn` from the folder that contains the `.pkl`.
- **Server error (500):** check the uvicorn terminal. The backend prints a traceback.
- **Wrong port:** update `target` in `vite.config.ts` and restart `npm run dev`.
