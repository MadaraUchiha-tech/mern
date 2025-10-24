# ChatApp – Deployment Guide for Render + Vercel

Your MERN chat app is **production-ready** and tested locally. Follow these steps to deploy.

## Deployment Architecture
- **Backend**: Render (https://render.com)
- **Frontend**: Vercel (https://vercel.com)

Both are connected via CORS and Socket.io.

---

## Step 1: Deploy Backend to Render

### 1a. Prepare backend secrets on Render

1. Go to [render.com](https://render.com) and sign in with GitHub.
2. Click **New +** → **Web Service**.
3. Connect your GitHub repo (ChatApp).
4. Configure:
   - **Name**: chatapp-backend (or your choice)
   - **Environment**: Node
   - **Region**: Choose nearest to your users
   - **Branch**: master
   - **Root directory**: (leave blank; uses repo root)
   - **Build command**: `npm install`
   - **Start command**: `npm start`
   - **Auto-deploy**: Yes

### 1b. Set Environment Variables

In Render dashboard, go to your service → **Environment** and add:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://navjeet24bcs10281_db_user:CCeT4iBN43tW1hXH@cluster0.ehk7orf.mongodb.net/?appName=Cluster0
JWT_SECRET=your_strong_secret_here
CLOUDINARY_CLOUD_NAME=dxhmluzfj
CLOUDINARY_API_KEY=413159332552471
CLOUDINARY_SECRET_KEY=ot6L0Yb_TYdSW2e21PCTlGq_DKY
FRONTEND_URL=https://your-frontend.vercel.app
ALLOWED_ORIGINS=https://your-frontend.vercel.app
SERVE_CLIENT=false
```

> Replace `your-frontend.vercel.app` with your actual Vercel domain (you'll create this next).
> Keep JWT_SECRET private; generate a random strong string.

### 1c. Deploy

Click **Create Web Service**. Render will start building and deploying. Wait for:
```
✓ Deploy successful
```

Your backend URL will be: `https://chatapp-backend.onrender.com` (or similar).

### 1d. Health check

Test: `curl https://chatapp-backend.onrender.com/health`
Expected: `{"status":"ok"}`

---

## Step 2: Deploy Frontend to Vercel

### 2a. Create new project on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New** → **Project**.
3. Import your ChatApp repo.
4. Configure:
   - **Project name**: chatapp-frontend (or your choice)
   - **Root directory**: `frontend`
   - **Framework**: Vite (auto-detected)
   - **Build command**: `npm run build`
   - **Output directory**: `dist`

### 2b. Set Environment Variables

In Vercel dashboard, go to your project → **Settings** → **Environment Variables** and add:

```
VITE_API_URL=https://chatapp-backend.onrender.com/api
VITE_SOCKET_URL=https://chatapp-backend.onrender.com
```

> Replace the domain with your actual Render backend URL from Step 1d.

### 2c. Deploy

Click **Deploy**. Vercel will build and deploy. Wait for the green checkmark.

Your frontend URL will be: `https://your-project.vercel.app` (shown in dashboard).

---

## Step 3: Update Backend CORS for Frontend URL

1. Go back to Render dashboard → your chatapp-backend service.
2. Click **Environment**.
3. Update `FRONTEND_URL` and `ALLOWED_ORIGINS` to your Vercel URL:
   ```
   FRONTEND_URL=https://your-project.vercel.app
   ALLOWED_ORIGINS=https://your-project.vercel.app
   ```
4. Click **Save** and wait for the service to redeploy.

---

## Step 4: Test the Live App

1. Open your frontend URL: `https://your-project.vercel.app`
2. Click **Sign Up** and create an account.
3. Your browser cookies should now have a `jwt` cookie from `chatapp-backend.onrender.com` (check DevTools → Application → Cookies).
4. Upload a profile picture or send a message to test Cloudinary and Socket.io.

---

## Troubleshooting

### Frontend shows blank page or 404
- Check Vercel build logs for errors.
- Ensure `VITE_API_URL` is set correctly in Vercel env vars.

### Login/Signup fails (401, CORS error, or "invalid credentials")
- Verify `FRONTEND_URL` in Render matches your Vercel domain exactly.
- Check DevTools → Network tab; look for failed requests to `/api/auth/...`.
- Verify cookies are being set (DevTools → Application → Cookies).

### Messages not sending or not real-time
- Ensure `VITE_SOCKET_URL` is set to your backend domain (no `/api`).
- Check DevTools → Network → WS tab for WebSocket connection to `/socket.io`.
- Verify Cloudinary credentials if image uploads fail.

### MongoDB connection error on Render
- Test the URI locally first.
- Verify your IP is whitelisted in MongoDB Atlas (cluster security → Network Access).

---

## Key Changes Made for Production

- **CORS**: Now allowlisted via `FRONTEND_URL` and `ALLOWED_ORIGINS` env vars.
- **Cookies**: Set `SameSite=None; Secure` for cross-domain auth in production.
- **Socket.io**: Configurable via `VITE_SOCKET_URL` for frontend.
- **Trust Proxy**: Enabled on backend to handle proxies (Render uses them).
- **Health Check**: `/health` endpoint for uptime monitoring.
- **Error Handling**: MongoDB connection errors exit cleanly for platform restarts.
- **No Password Leaks**: Auth responses sanitize passwords before sending.

---

## Local Development (Optional)

If you want to test locally again:

1. Ensure `.env` exists at repo root with real credentials (already done).
2. Backend: `npm run dev` (listens on http://localhost:8000)
3. Frontend: `npm run dev --prefix frontend` (listens on http://localhost:5173 or 5174)
4. Both should connect via the Vite dev proxy.

---

## Next Steps (Optional Improvements)

- Add error monitoring (Sentry).
- Set up CI/CD for auto-deploy on master push.
- Add rate limiting (helmet/express-rate-limit).
- Add logging (morgan/pino).
- Upgrade to custom domains on Render/Vercel.

---

**Deployed?** Share your frontend URL and test with a friend! 🎉
