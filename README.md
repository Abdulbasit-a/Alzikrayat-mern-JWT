# Alzikrayat — MERN Edition

A full-stack photo-sharing application (Advanced Web Technologies, Course Project 3 + **Bonus Project 4 — Track A: JWT Authentication**), rebuilt from the original
Python/Flask + MySQL version of "الذكريات". Same Arabic right-to-left design, colours (amber `#d97706` on cream),
fonts (Amiri + Cairo) and logo; the stack is now MongoDB + Express + React + Node.
Users register, log in, upload photos, browse a responsive gallery, comment, and delete their own photos and comments.

**Stack:** MongoDB + Mongoose · Express.js · React (Vite) + React Router · Node.js · JWT (`jsonwebtoken`)
No meta-frameworks, no admin templates, no CSS framework (the styling is a single hand-written `app.css`).
Server helpers: Joi, cors, dotenv, multer, bcryptjs, jsonwebtoken. Client: axios and the Cairo/Amiri fonts (bundled locally).

## Features

- Arabic, right-to-left interface in the original design; every message (including server errors) is in Arabic
- Register / login with bcrypt-hashed passwords and **JWT (Bearer token) sessions**; toolbar shows "مرحباً، *name*" + upload + logout, or login / register buttons
- "Last login" strip (as in the Flask version): the previous login time is stored in MongoDB and shown after the next login
- Photo upload with drag & drop and preview (multer, files in `server/uploads/`, metadata in MongoDB), logged-in users only
- Home page (banner, real counters, latest photos) and a Gallery page with three display styles (list, 4 columns, 3 columns); the choice is remembered
- Photo detail page (`/photos/:id`) with metadata and comments; comments appear instantly, no page reload
- Delete a photo (with its comments and file) or a comment — **owner/author only, checked on the server**
- Loading, error and empty states everywhere

## Project structure

```
server/
├── models/        User.js, Photo.js, Comment.js            (Mongoose schemas)
├── routes/        authRoutes.js, photoRoutes.js, commentRoutes.js
├── controllers/   authController.js, photoController.js, commentController.js
├── middleware/    auth.js (JWT verification), validation.js (Joi), upload.js (multer), errorHandler.js
├── utils/         token.js (sign / verify JWT)
├── scripts/       generateSecret.js (creates JWT_SECRET in .env)
├── uploads/       stored images (git-ignored)
├── .env.example   copy to .env
└── server.js

client/
├── src/
│   ├── components/  Layout, Navbar, Logo, PhotoCard, PhotoGallery, CommentForm, CommentList,
│   │                LoginForm, RegisterForm, ProtectedRoute, StatusMessage
│   ├── pages/       Home, Gallery, PhotoDetail, LoginRegister, Upload, NotFound
│   ├── context/     AuthContext.jsx (logged-in user + JWT)
│   ├── utils/       api.js (axios + JWT interceptors), storage.js (token + user), format.js
│   ├── styles/      app.css
│   ├── App.jsx      routes
│   └── main.jsx
├── public/vector.svg   the logo (copied unchanged from the Flask project)
├── index.html
└── vite.config.js      dev proxy: /api and /uploads -> Express
```

## Quick start (Windows)

Make sure MongoDB is running, then double-click **`start.bat`**. It checks/installs the packages (instant when already installed) and creates
`server/.env` if missing (and generates a random `JWT_SECRET` in it), then starts the server and the client and opens http://localhost:3000.

## Running locally (manual)

**Prerequisites:** Node.js 18+ and a MongoDB instance (local `mongod` or a MongoDB Atlas URI).

```bash
# 1. API
cd server
cp .env.example .env        # then edit MONGODB_URI if needed
node scripts/generateSecret.js   # writes a random JWT_SECRET into .env
npm install
npm run dev                 # http://localhost:5000

# 2. Client (in a second terminal)
cd client
npm install
npm run dev                 # http://localhost:3000
```

Open http://localhost:3000. The Vite dev server proxies `/api` and `/uploads` to the API.

### Environment variables (`server/.env`)

| Variable        | Default                                | Purpose                                  |
| --------------- | -------------------------------------- | ---------------------------------------- |
| `MONGODB_URI`   | `mongodb://127.0.0.1:27017/alzikrayat` | MongoDB connection string                |
| `PORT`          | `5000`                                 | Port of the Express API                  |
| `CLIENT_ORIGIN` | `http://localhost:3000`                | Origin allowed by CORS                   |
| `JWT_SECRET`    | – (**required**)                       | Secret that signs/verifies tokens. The server refuses to start without it. Generate with `node scripts/generateSecret.js` |
| `JWT_EXPIRES_IN`| `1d`                                   | Token lifetime (`15m`, `1h`, `1d`, `7d`…) |

`.env` is git-ignored — never commit it.

## REST API

| Method | Endpoint                      | Auth | Description                                   | Success / errors            |
| ------ | ----------------------------- | ---- | --------------------------------------------- | --------------------------- |
| POST   | `/api/auth/register`          | –    | Create an account (password 8–72 chars); returns `token` + `user` | 201 · 400 · 409 (duplicate) |
| POST   | `/api/auth/login`             | –    | Log in; returns `token` + profile + previous login time (`lastLogin`) | 200 · 400 · 401 |
| GET    | `/api/auth/me`                | yes  | Validate the token and return the current user | 200 · 401                   |
| GET    | `/api/photos?limit=n`         | –    | List photos, newest first                     | 200                         |
| GET    | `/api/photos/stats`           | –    | Counters for the home page                    | 200                         |
| GET    | `/api/photos/:id`             | –    | One photo                                     | 200 · 400 · 404             |
| POST   | `/api/photos`                 | yes  | Upload (`multipart/form-data`: photo, title, description) | 201 · 400 · 401 |
| DELETE | `/api/photos/:id`             | yes  | Delete own photo                              | 200 · 401 · 403 · 404       |
| GET    | `/api/photos/:id/comments`    | –    | Comments of a photo, oldest first             | 200 · 404                   |
| POST   | `/api/photos/:id/comments`    | yes  | Add a comment                                 | 201 · 400 · 401 · 404       |
| DELETE | `/api/photos/:id/comments/:commentId` | yes | Delete own comment                      | 200 · 401 · 403 · 404       |

Responses use the shape `{ success, message?, data? }`; validation errors add an `errors` array.

## Authentication — JWT (Bonus Project 4, Track A)

**Track and rationale.** Project 3 identified users with an `x-user-id` header. User ids are visible in API
responses, so anyone could send another user's id and delete their photos or comments. JWT fixes this: the server
issues a **signed, expiring token** at login and trusts only requests that carry a valid one. It was chosen because
it closes a real security hole in the existing code and touches few files, so no Project 3 feature breaks.

**How it works**

1. `POST /api/auth/login` (or `/register`) verifies the credentials (bcrypt) and returns `{ token, user }`.
2. A JWT is `HEADER.PAYLOAD.SIGNATURE`: header `{alg: HS256, typ: JWT}`, payload `{sub: <user id>, iat, exp}`, and an
   HMAC-SHA256 signature made with `JWT_SECRET`. The payload is only Base64-encoded (readable), so it holds no secrets.
3. The client stores the token in `localStorage` and an **Axios request interceptor** adds
   `Authorization: Bearer <token>` to every request (`client/src/utils/api.js`).
4. The **`auth` middleware** (`server/middleware/auth.js`) checks the signature (algorithm pinned to HS256) and expiry,
   then loads the user from MongoDB into `req.user`. It protects every write operation: upload photo, delete photo,
   add comment, delete comment, and `GET /api/auth/me`. Reading photos and comments stays public.
5. Logout deletes the token on the client (JWTs are stateless, so the server keeps no session to destroy).
6. If the server answers 401 (expired or invalid token), a **response interceptor** logs the user out automatically.

Responses: no / malformed token → 401 · expired token → 401 · tampered or wrongly signed token → 401 ·
deleted account → 401 · someone else's photo/comment → 403.

**Setup:** set `JWT_SECRET` in `server/.env` (`node scripts/generateSecret.js` does it), then run the app as shown above.
Users who were logged in before this upgrade are simply asked to log in again.

**Limitations (honest notes)**

- The token is in `localStorage`, so a cross-site-scripting bug could expose it (React escapes output by default, which
  helps). Keeping it only in memory is safer but logs the user out on every refresh; an httpOnly cookie is the
  production-grade alternative.
- A token cannot be revoked before it expires (the cost of being stateless). This is why the lifetime is short (`1d` by default).
- The optional refresh-token flow is not implemented.

## Security notes

- Passwords are hashed with bcrypt (`select: false` on the field, never returned)
- Sessions use signed JWTs; `JWT_SECRET` is read from `.env` only, and the server will not start without it
- Input is validated server-side with Joi (same rules as the Flask version: letters-only names, email ≤ 100, password 8–72, title ≤ 200, description/comment ≤ 1000) and by Mongoose schemas
- Uploads: images only (JPG/PNG/GIF/WEBP), max 10 MB; the stored file extension is derived from the MIME type, not the user's file name
- Secrets live in `.env`, which is excluded from Git

## Deployment note

In production the client is served separately from the API, so the `/api` and `/uploads` proxy from `vite.config.js`
no longer applies. Serve both behind one domain (reverse proxy) or change `baseURL` in `client/src/utils/api.js`
and `imageUrl` accordingly, and set `CLIENT_ORIGIN` on the server.
