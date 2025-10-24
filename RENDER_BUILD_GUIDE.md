# Render Build Status & Debugging Guide

## Expected Build Steps (Render Console)

When Render deploys your backend, it will execute:

1. **Clone repo** ✓
2. **Detect Node.js** (should be v18+)
3. **Run build command**: `npm install`
   - Installs dependencies from `package.json` and `package-lock.json`
4. **Run start command**: `npm start`
   - Executes `node backend/app.js`
5. **Health check** (GET `/health`)
   - Should return `{ "status": "ok" }`

---

## Expected Console Output (on successful start)

```
[dotenv@17.2.1] injecting env (n) from .env
mongoDB connected: <your-mongo-host>
server running on port 10000
```

> Note: Render assigns a random `PORT` (usually 10000+). The app reads `process.env.PORT` automatically.

---

## Build Failure Scenarios & Fixes

### 1. **"MONGODB_URI is not set"**
- **Cause**: Missing env var in Render dashboard
- **Fix**: Go to Render → your service → Environment → add `MONGODB_URI`

### 2. **"Failed to connect to MongoDB"**
- **Cause**: URI is invalid, MongoDB Atlas IP whitelist doesn't include Render
- **Fix**: 
  - Test URI locally: `mongodb+srv://user:pass@cluster.mongodb.net/...`
  - In MongoDB Atlas → Cluster → Network Access → add `0.0.0.0/0` (allows all IPs)

### 3. **"Cannot find module 'express'"**
- **Cause**: Render didn't run `npm install` or dependencies failed
- **Fix**: Check Render build log for npm errors; retry the deployment

### 4. **"SyntaxError in backend/app.js"**
- **Cause**: Code has syntax error (unlikely—already tested locally)
- **Fix**: Unlikely; code was verified. Check console for exact line number.

### 5. **Service timeout or "Port already in use"**
- **Cause**: App started but Render couldn't reach health check endpoint
- **Fix**: Wait 30s for app to fully boot; if still failing, check `MONGODB_URI` again

---

## How to Monitor Build Status

1. Go to https://render.com → Your Service → Logs
2. Look for:
   - ✅ **Active** status (green) → Everything OK
   - 🔴 **Failed** status (red) → Click for error logs
3. Share the error message for debugging

---

## Once Backend is Running on Render

1. Test health endpoint:
   ```bash
   curl https://your-backend-url.onrender.com/health
   ```
   Expected: `{"status":"ok"}`

2. Update Vercel frontend env vars with your Render URL:
   - `VITE_API_URL=https://your-backend-url.onrender.com/api`
   - `VITE_SOCKET_URL=https://your-backend-url.onrender.com`

3. Redeploy Vercel frontend

---

## Backend Environment Variables (for Render)

Make sure all these are set in Render → Environment:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://navjeet24bcs10281_db_user:CCeT4iBN43tW1hXH@cluster0.ehk7orf.mongodb.net/?appName=Cluster0
JWT_SECRET=<your-strong-secret>
CLOUDINARY_CLOUD_NAME=dxhmluzfj
CLOUDINARY_API_KEY=413159332552471
CLOUDINARY_SECRET_KEY=ot6L0Yb_TYdSW2e21PCTlGq_DKY
FRONTEND_URL=https://your-vercel-app.vercel.app
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
SERVE_CLIENT=false
```

---

## Quick Checklist

- [ ] Render build command: `npm install`
- [ ] Render start command: `npm start`
- [ ] MONGODB_URI set in Render
- [ ] JWT_SECRET set in Render
- [ ] CLOUDINARY_* set in Render
- [ ] FRONTEND_URL set to your Vercel domain
- [ ] Build completes with "Active" status
- [ ] Health check returns 200 OK
- [ ] Vercel frontend env vars updated with backend URL

---

**Status**: Backend is deployment-ready. Render should succeed within 2-5 minutes. 🚀
