# Vercel Deployment Guide

This project is deployed as two Vercel projects:

- Backend API from `server/`
- Frontend React app from `client/`

## What Was Changed

- Backend entrypoint now supports both local server mode and Vercel serverless mode.
- MongoDB connection is reused between requests when possible.
- CORS now supports a production allowlist via `CORS_ORIGINS`.
- Frontend API requests now use `REACT_APP_API_BASE_URL` through `client/src/services/api.js`.
- Added deployment config files:
  - `server/vercel.json`
  - `client/vercel.json`
- Added env templates:
  - `server/.env.example`
  - `client/.env.example`

## 1. Deploy Backend (server)

### 1.1 Create backend project in Vercel

1. Open Vercel dashboard.
2. Click New Project.
3. Import this GitHub repository.
4. Configure:
   - Project Name: your choice (example: textile-api)
   - Root Directory: `server`
   - Framework Preset: Other

### 1.2 Add backend environment variables

In Project Settings -> Environment Variables, add:

- `MONGODB_URI` = your MongoDB Atlas connection string
- `JWT_SECRET` = long random string
- `ADMIN_ROLL` = your admin roll
- `CORS_ORIGINS` = your frontend domain, for example:
  - `https://textile-web.vercel.app`

Optional:

- `NODE_ENV` = `production`

### 1.3 Deploy and verify

1. Click Deploy.
2. After deploy, open:
   - `https://your-backend-domain.vercel.app/api/health`
3. You should get JSON status response.

## 2. Deploy Frontend (client)

### 2.1 Create frontend project in Vercel

1. Click New Project again in Vercel.
2. Import the same GitHub repository.
3. Configure:
   - Project Name: your choice (example: textile-web)
   - Root Directory: `client`
   - Framework Preset: Create React App (or auto-detected)

### 2.2 Add frontend environment variable

In frontend project settings, add:

- `REACT_APP_API_BASE_URL` = your backend deployment URL, for example:
  - `https://your-backend-domain.vercel.app`

Important: do not include a trailing slash.

### 2.3 Deploy frontend

1. Click Deploy.
2. Open your frontend URL.
3. Test login, semesters, and admin actions.

## 3. Final CORS Sync

After frontend deploy, make sure backend `CORS_ORIGINS` matches frontend URL exactly.

If you changed it:

1. Update backend env var.
2. Redeploy backend.

## 4. Recommended Production Checklist

- Use MongoDB Atlas (not local MongoDB URI).
- Rotate `JWT_SECRET` if previously exposed.
- Keep one stable production domain for frontend.
- If backend URL changes, update frontend `REACT_APP_API_BASE_URL` and redeploy frontend.

## 5. Local Development Still Works

- Backend local: `cd server && npm start`
- Frontend local: `cd client && npm start`

Local React proxy still handles `/api` when `REACT_APP_API_BASE_URL` is not set.
