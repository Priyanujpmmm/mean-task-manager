# TaskFlow — MEAN Stack Task Manager

The same task manager app as the MERN version, rebuilt with **MongoDB, Express, Angular, and Node.js**. Same features, same API, same look — just an Angular frontend instead of React.

## Features

- User registration & login with hashed passwords (bcrypt) and JWT tokens
- Protected API routes (Express middleware) and protected Angular routes (route guard)
- Create, read, update, delete tasks (each user only sees their own)
- Task priority levels, due dates, and completion status
- Filter tasks by All / Active / Completed
- Clean, responsive UI, no external CSS framework needed

## Tech Stack

| Layer     | Technology                                   |
|-----------|-----------------------------------------------|
| Frontend  | Angular 17 (standalone components), RxJS      |
| Backend   | Node.js, Express                              |
| Database  | MongoDB, Mongoose                             |
| Auth      | JSON Web Tokens (JWT), bcryptjs                |

## Project Structure

```
mean-task-manager/
├── backend/                     # Identical to the MERN backend — framework-agnostic API
│   ├── config/db.js
│   ├── models/User.js
│   ├── models/Task.js
│   ├── middleware/auth.js
│   ├── routes/authRoutes.js
│   ├── routes/taskRoutes.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
└── frontend/                    # Angular 17 standalone app
    ├── src/
    │   ├── app/
    │   │   ├── models/              # Task & User TypeScript interfaces
    │   │   ├── services/            # AuthService, TaskService (HttpClient + RxJS)
    │   │   ├── interceptors/        # auth.interceptor.ts — attaches JWT, handles 401s
    │   │   ├── guards/               # auth.guard.ts — protects the dashboard route
    │   │   ├── components/           # navbar, task-form, task-item (standalone)
    │   │   ├── pages/                 # login, register, dashboard (lazy-loaded routes)
    │   │   ├── app.component.ts
    │   │   ├── app.config.ts         # providers: router, HttpClient + interceptor
    │   │   └── app.routes.ts
    │   ├── environments/             # API URL config (dev/prod)
    │   ├── styles.css                # Global styling
    │   └── index.html
    ├── angular.json
    └── package.json
```

## Prerequisites

- Node.js v18+ installed
- Angular CLI (installed automatically via `npx` commands below, no global install needed)
- A MongoDB database — either:
  - **Local MongoDB**: install and run `mongod` locally, or
  - **MongoDB Atlas** (free tier): create a cluster at https://www.mongodb.com/cloud/atlas and copy the connection string

## Setup Instructions

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mean_task_manager
JWT_SECRET=your_long_random_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:4200
```

> Generate a strong `JWT_SECRET` with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

### 2. Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
```

The API URL is set in `src/environments/environment.ts` (defaults to `http://localhost:5000/api`, matching the backend above — edit it if you changed the backend port).

Start the Angular dev server:

```bash
npm start
```

(equivalent to `ng serve`). The app runs at `http://localhost:4200`. Open it, register an account, and start adding tasks.

## API Reference

Same API as the MERN version — the backend is 100% shared:

| Method | Endpoint             | Auth required | Description             |
|--------|-----------------------|:--------------:|--------------------------|
| POST   | `/api/auth/register`  | No             | Create a new user        |
| POST   | `/api/auth/login`     | No             | Log in, returns JWT      |
| GET    | `/api/auth/me`        | Yes            | Get current user profile |
| GET    | `/api/tasks`          | Yes            | List current user's tasks|
| POST   | `/api/tasks`          | Yes            | Create a task             |
| PUT    | `/api/tasks/:id`      | Yes            | Update a task              |
| DELETE | `/api/tasks/:id`      | Yes            | Delete a task              |

Authenticated requests must include a header: `Authorization: Bearer <token>`

## How the Angular Pieces Fit Together

- **`AuthService`** — holds a `BehaviorSubject<User | null>` so any component can reactively subscribe to the logged-in user via `currentUser$`. Handles login/register/logout and reads/writes the JWT + user object to `localStorage`.
- **`authInterceptor`** (functional interceptor) — automatically attaches `Authorization: Bearer <token>` to every outgoing HTTP request, and logs the user out + redirects to `/login` on any 401 response.
- **`authGuard`** (functional route guard) — blocks navigation to `/dashboard` if there's no valid token, redirecting to `/login` instead.
- **Standalone components** — no `NgModule` boilerplate; each component declares its own imports (`CommonModule`, `ReactiveFormsModule`, etc.) directly in its `@Component` decorator.
- **Lazy-loaded routes** — `login`, `register`, and `dashboard` are all loaded on demand via `loadComponent()` in `app.routes.ts`, keeping the initial bundle small.

## Deployment Notes

- **Backend**: deploy to Render, Railway, or a VM; set the same environment variables from `.env.example` (use MongoDB Atlas for the database in production).
- **Frontend**: run `ng build` to produce a static `dist/frontend` folder, then deploy it to Vercel, Netlify, or any static host. Update `src/environments/environment.prod.ts` with your deployed backend URL before building, and set the backend's `CLIENT_URL` to your deployed frontend URL (for CORS).

## Ideas to Extend This Project

- Add task categories/tags and search
- Add pagination for large task lists
- Add Angular Material or Tailwind for a different visual style
- Add unit tests with Jasmine/Karma (already scaffolded by Angular CLI)
- Add an `HttpClient` loading interceptor for global spinners
- Deploy it and compare side-by-side with your MERN version on your resume
