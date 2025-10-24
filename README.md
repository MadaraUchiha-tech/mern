# ChatApp (MERN) – Deployment Guide

This project is a MERN chat application with real-time messaging via Socket.io, image upload via Cloudinary, and a Vite/React frontend.

## What changed in this commit
- Backend CORS is now env-driven and production-safe.
- Secure cookie handling for auth (SameSite/secure) in production.
- Fixed production static path and added a health endpoint.
- Improved error handling on Mongo connect and trust proxy in prod.
- Frontend Axios now supports `VITE_API_URL` for production.
- Socket.io client URL configurable via `VITE_SOCKET_URL` or `VITE_API_URL`.
- Fixed a syntax error in `frontend/src/store/authStore.js` (stray backticks).
- Added `.env.example` files for backend and frontend.
- Fixed Vite dev proxy.

## Environment configuration

Copy the sample env files and fill them out.

Root (backend):
- Copy `.env.example` to `.env` and set:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `FRONTEND_URL` (e.g., your Vercel URL)
  - `ALLOWED_ORIGINS` (comma-separated, optional)
  - `CLOUDINARY_*`

Frontend:
- Copy `frontend/.env.example` to `frontend/.env` and set:
  - `VITE_API_URL` → `https://<your-backend-domain>/api`
  - `VITE_SOCKET_URL` (optional) → `https://<your-backend-domain>`

## Local development

- Backend: `npm run dev` (from repo root). Requires a reachable `MONGODB_URI`.
- Frontend: `npm run dev --prefix frontend` (or open a second terminal and run in `frontend/`).

## Production deployment

Recommended split-deploy:

1) Backend (Render or Railway)
- Service type: Web Service
- Root directory: repository root
- Build command: `npm install`
- Start command: `npm start`
- Environment variables (same as `.env`):
  - `NODE_ENV=production`
  - `PORT=10000` (Render auto-assigns, leave empty; the app reads `process.env.PORT`)
  - `MONGODB_URI=<your-uri>`
  - `JWT_SECRET=<your-secret>`
  - `FRONTEND_URL=https://<your-frontend>.vercel.app`
  - `ALLOWED_ORIGINS=https://<your-frontend>.vercel.app`
  - `CLOUDINARY_*`
- Health check path: `/health`

2) Frontend (Vercel)
- Project root: `frontend/`
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables:
  - `VITE_API_URL=https://<your-backend-domain>/api`
  - `VITE_SOCKET_URL=https://<your-backend-domain>`

Notes
- Cookies: In production we set `SameSite=None; Secure` and `trust proxy` for compatibility with Render/Vercel on separate domains.
- CORS: Only domains in `FRONTEND_URL` or `ALLOWED_ORIGINS` are allowed.

## Monorepo scripts

From repository root:
- Install backend deps: `npm install`
- Install frontend deps: `npm install --prefix frontend`
- Build frontend: `npm run build --prefix frontend`
- Start backend: `npm start`

## Troubleshooting
- 401/unauthorized: Ensure cookies are being set; check DevTools Application > Cookies for your backend domain.
- CORS errors: Ensure your deployed frontend origin is in `FRONTEND_URL` or `ALLOWED_ORIGINS`.
- Socket not connecting: Verify `VITE_SOCKET_URL` or `VITE_API_URL` points to the backend origin (no `/api` suffix for sockets). Ensure Render allows WebSockets (it does).
- Images not uploading: Verify Cloudinary credentials and that the base64 size is within Cloudinary limits.

