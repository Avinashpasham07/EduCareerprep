EduCareerPrep (MERN)

Monorepo with `client` (React + Redux Toolkit + Tailwind) and `server` (Express + MongoDB + JWT).

Setup
- Create `server/.env` with PORT, MONGO_URI, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, CLIENT_URL.
- Install deps: `npm i` in `client` and `server`.
- Seed DB: `cd server && npm run seed`.
- Run: `npm run dev` in `server`, `npm start` in `client`.

Endpoints
- Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh`.
- Docs: `/api/docs`.

