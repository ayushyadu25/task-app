# TaskFlow

TaskFlow is a beginner-to-intermediate full-stack task and project management app. It is now split into two separately deployable folders:

- `frontend/` - React + Vite app
- `backend/` - Node.js + Express + MongoDB Atlas API

The frontend and backend can be deployed on different cloud platforms. API keys and secrets stay in the backend environment only.

## Features

- Register, login, logout, and JWT session persistence
- User-owned boards/projects
- Task CRUD with To Do, In Progress, and Done columns
- Priority, due date, effort estimate, filtering, sorting, and overdue cues
- Light/dark mode
- Gemini-powered task effort and due-date helper
- Fallback estimate if Gemini is unavailable

## Local Start

Install dependencies once:

```powershell
cd C:\Users\yaduv\Desktop\taskProject
npm.cmd install
npm.cmd --prefix backend install
npm.cmd --prefix frontend install
```

Then start both apps from the project root:

```powershell
cd C:\Users\yaduv\Desktop\taskProject
npm.cmd run dev
```

Open the local URL Vite prints in your terminal. It is usually:

```text
http://127.0.0.1:5173
```

If Vite says `5173` is busy, it may use another port like `5174` or `5175`; open that printed URL.

If your PowerShell allows normal npm commands, this also works:

```powershell
npm run dev
```

## Run Separately

Backend:

```powershell
cd C:\Users\yaduv\Desktop\taskProject\backend
npm.cmd install
npm.cmd run dev
```

Backend health check:

```text
http://localhost:5000/api/health
```

Frontend:

```powershell
cd C:\Users\yaduv\Desktop\taskProject\frontend
npm.cmd install
npm.cmd run dev
```

Frontend URL:

```text
http://127.0.0.1:5173
```

## Environment Files

Backend environment file:

```text
backend/.env
```

Required backend variables:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/taskflow?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://127.0.0.1:5173,http://localhost:5173
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash-lite
```

Frontend environment file:

```text
frontend/.env
```

Required frontend variable:

```env
VITE_API_URL=http://127.0.0.1:5000/api
```

Do not put MongoDB, JWT, or Gemini secrets in the frontend.

During local development, the backend accepts `localhost` and `127.0.0.1` frontend origins on any port, so registration still works if Vite starts on `5175`.

## Deploy Backend

Deploy the `backend/` folder to a Node backend host such as Render, Railway, Fly.io, or Cyclic.

Common settings:

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/api/health`

Set these environment variables in the backend cloud dashboard:

```env
MONGO_URI=your-mongodb-atlas-uri
JWT_SECRET=your-production-secret
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=https://your-frontend-domain.com
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash-lite
```

After deployment, your backend API will look like:

```text
https://your-backend-domain.com/api
```

## Deploy Frontend

Deploy the `frontend/` folder to a frontend host such as Vercel, Netlify, or Cloudflare Pages.

Common settings:

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`

Set this frontend environment variable:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

After changing `VITE_API_URL`, redeploy the frontend because Vite reads this variable at build time.

## API Routes

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Boards:

- `GET /api/boards`
- `POST /api/boards`
- `GET /api/boards/:id`
- `PATCH /api/boards/:id`
- `DELETE /api/boards/:id`

Tasks:

- `GET /api/tasks/board/:boardId`
- `POST /api/tasks`
- `GET /api/tasks/:id`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`

AI:

- `POST /api/ai/task-estimate`

## Folder Structure

```text
frontend/
  src/
    api/
    components/
    context/
    pages/
    styles/
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    utils/
    validators/
```

## Verification

These checks passed after splitting the project:

```powershell
npm.cmd --prefix backend run check
npm.cmd --prefix frontend run check
```

The separated backend was also started successfully and connected to MongoDB Atlas.
