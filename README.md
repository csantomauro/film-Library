# Film Library

A full-stack web application for managing a personal film library. Users can log in, add films with ratings and watch dates, mark favourites, and filter their collection.

**Live demo:** https://film-library-one.vercel.app

---

## Tech stack

| Layer      | Technology                                            |
| ---------- | ----------------------------------------------------- |
| Frontend   | React 18, React Router v6, React Bootstrap            |
| Backend    | Node.js, Express                                      |
| Database   | PostgreSQL (hosted on Render)                         |
| Auth       | Passport.js (local strategy), express-session, scrypt |
| Deployment | Vercel (frontend), Render (backend + DB)              |

---

## Features

- Session-based authentication with secure, HttpOnly cookies
- Add, edit, and delete films
- Rate films 1–5 stars and mark them as favourites
- Filter films by: All, Favourites, Best Rated, Seen Last Month, Unseen
- Client-side search bar to filter by title
- Responsive layout with collapsible sidebar on mobile
- Toast notifications for errors and actions

---

## Project structure

```
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/      # UI components (Header, FilmList, FilmForm, …)
│   │   ├── contexts/        # FeedbackContext
│   │   ├── models/          # Film.js — shared data model
│   │   ├── API.js           # All fetch calls to the backend
│   │   └── App.jsx          # Root component, routing, top-level state
│   └── index.html
│
└── server/                  # Express backend
    ├── dao-films.mjs        # Film DB queries
    ├── dao-users.mjs        # User DB queries + password verification
    ├── db.mjs               # PostgreSQL connection pool
    ├── Film.mjs             # Server-side Film model
    └── server.mjs           # Express app, routes, Passport setup
```

---

## Running locally

### Prerequisites

- Node.js ≥ 18
- A PostgreSQL database (local or remote)

### Backend

```bash
cd server
npm install
```

Create a `.env` file in `/server`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=filmLibrary
DB_USER=your_user
DB_PASS=your_password
SESSION_SECRET=a_long_random_string
PORT=3000
```

```bash
node server.mjs
```

### Frontend

```bash
cd app
npm install
npm run dev
```

The app will be available at `http://localhost:5173`. Make sure the `SERVER_URL` in `API.js` points to `http://localhost:3000/api` for local development.

## Test credentials
- **Email:** user@filmLibrary.com
- **Password:** password

### Database schema

```sql
CREATE TABLE users (
    id    SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name  TEXT NOT NULL,
    hash  TEXT NOT NULL,
    salt  TEXT NOT NULL
);

CREATE TABLE films (
    id         SERIAL PRIMARY KEY,
    title      TEXT    NOT NULL,
    isFavorite BOOLEAN NOT NULL DEFAULT FALSE,
    rating     INTEGER CHECK (rating BETWEEN 1 AND 5),
    watchDate  DATE,
    userId     INTEGER REFERENCES users(id)
);
```
