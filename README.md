# Express TypeScript Boilerplate

A production-ready REST API starter built with Express 5, TypeScript, PostgreSQL, and a carefully chosen set of modern tools. Clone it, configure your environment, and start building features — not infrastructure.

---

## Why This Boilerplate

Most Express starters are either too minimal (no auth, no validation, no error handling) or too opinionated (tied to a specific cloud or deployment model). This one hits the middle ground:

- Full authentication flow included out of the box
- Consistent, predictable response format across all endpoints
- Type-safe from database schema to HTTP response — no runtime surprises
- Clean layered architecture that scales naturally as you add modules

---

## Features

### Included

- **JWT Authentication** — register, login, and protected route support with Bearer token validation
- **User Management** — full CRUD with pagination, search, and sorting
- **Request Validation** — Zod schemas on all inputs; validation errors return structured field-level messages
- **Standardized Responses** — every endpoint returns the same predictable JSON shape
- **Global Error Handling** — domain exceptions, validation errors, and unexpected errors all handled centrally
- **Structured Logging** — pretty-printed in development, JSON in production via Pino
- **Security Headers** — Helmet applied globally
- **CORS** — configurable allowed origins via environment variable
- **Database Migrations** — version-controlled SQL migrations with Drizzle ORM
- **Database Seeding** — seed scripts for initial data
- **Graceful Shutdown** — handles SIGTERM and SIGINT cleanly
- **Docker Support** — optional multi-stage Dockerfile and Docker Compose setup for easy deployment

### Ready to Extend

- Role-based access control (auth middleware and JWT payload are already in place)
- Refresh token flow
- Additional feature modules (posts, products, organizations, etc.)
- File uploads
- Email verification and password reset
- Rate limiting
- API versioning

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20+ |
| Framework | Express 5 |
| Language | TypeScript (strict mode) |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| Validation | Zod 4 |
| Authentication | JWT (HS256) |
| Password Hashing | Argon2id |
| Logging | Pino |
| Build | tsup (ESM output) |
| Dev Runner | tsx (hot reload) |

---

## Project Structure

```
src/
├── app/              # Express app setup and server bootstrap
├── config/           # Environment variable validation and config
├── database/
│   ├── schemas/      # Drizzle table definitions
│   ├── migrations/   # Generated SQL migration files
│   └── seeders/      # Seed scripts
├── module/
│   ├── auth/         # Login, register, current user
│   └── user/         # User CRUD
└── shared/
    ├── constants/    # HTTP status codes and error messages
    ├── exceptions/   # Typed HTTP exceptions (400, 401, 403, 404, 409)
    ├── middlewares/  # Authentication, error handler, HTTP logger
    ├── schemas/      # Reusable Zod schemas (UUID params, pagination)
    ├── types/        # Shared TypeScript types
    └── utils/        # JWT, password, pagination, logger, response helpers
```

Each feature module follows a consistent structure:

```
module/
├── module.route.ts
├── module.controller.ts
├── module.service.ts
├── module.repository.ts
├── module.mapper.ts
├── schemas/
└── types/
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- PostgreSQL database
- Docker & Docker Compose (Optional)

### Installation

```bash
git clone https://github.com/your-username/expressjs-boilerplate.git
cd expressjs-boilerplate
pnpm install
```

### Configuration

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|---|---|---|
| `APP_URL` | Yes | Base URL of this API (e.g. `http://localhost:4000`) |
| `ALLOWED_ORIGINS` | Yes | Comma-separated list of allowed CORS origins |
| `NODE_ENV` | No | `development` \| `production` \| `test` (default: `development`) |
| `PORT` | No | Port to listen on (default: `8000`) |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret key for signing tokens (32+ characters recommended) |
| `JWT_EXPIRES_IN` | Yes | Token expiry duration (e.g. `1d`, `7d`, `2h`) |
| `LOG_LEVEL` | No | `error` \| `warn` \| `info` \| `debug` \| `trace` (default: `info`) |

### Database Setup (Local)

```bash
# Apply migrations
pnpm db:migrate

# Optional: seed initial data
pnpm db:seed
```

### Run (Local)

```bash
# Development (hot reload)
pnpm dev

# Production
pnpm build && pnpm start
```

---

## Docker Support (Optional)

You can run the entire stack (PostgreSQL + App) using Docker Compose. This is ideal for quick testing or production deployment.

1. Ensure `.env` is configured correctly.
2. In `.env`, set the host inside `DATABASE_URL` to point to the docker service, e.g.:
   `DATABASE_URL=postgresql://postgres:password@postgres:5432/db_name?schema=public`
3. Run the stack:

```bash
docker compose up --build -d
```

*Note: Migrations will automatically run when the app container starts up.*

---

## Available Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server with hot reload |
| `pnpm build` | Compile to `dist/` (ESM, minified) |
| `pnpm start` | Run the compiled build |
| `pnpm lint` | Check for lint errors |
| `pnpm lint:fix` | Auto-fix lint errors |
| `pnpm format` | Format source files with Prettier |
| `pnpm db:generate` | Generate a new migration from schema changes |
| `pnpm db:migrate` | Apply pending migrations |
| `pnpm db:push` | Push schema directly to DB (dev only) |
| `pnpm db:seed` | Run seed scripts |
| `pnpm db:studio` | Open Drizzle Studio (visual DB browser) |

---

## API Reference

### Base URL

```
http://localhost:8000/api
```

### Response Format

All endpoints return a consistent JSON structure.

**Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {}
}
```

**Paginated list:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": [],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

**Error:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Bad Request",
  "errors": {
    "email": ["Invalid email address"]
  }
}
```

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | — | Create a new account |
| `POST` | `/api/auth/login` | — | Sign in and receive a token |
| `GET` | `/api/auth/me` | Required | Get the current user |

**Register**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "secret123"
}
```

Returns an `accessToken` to use in subsequent requests:

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "accessToken": "eyJ...",
    "user": { "id": "...", "name": "Jane Doe", "email": "jane@example.com" }
  }
}
```

Pass the token in authenticated requests:

```http
Authorization: Bearer eyJ...
```

### Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/users` | — | Create a user |
| `GET` | `/api/users` | — | List users (paginated) |
| `GET` | `/api/users/:id` | Required | Get a user by ID |
| `PATCH` | `/api/users/:id` | Required | Update a user |
| `DELETE` | `/api/users/:id` | Required | Delete a user |

**Pagination & filtering** — all list endpoints accept:

| Parameter | Default | Description |
|---|---|---|
| `page` | `1` | Page number |
| `limit` | `10` | Items per page |
| `search` | — | Filter by name or email |
| `sortBy` | `createdAt` | Column to sort by |
| `sortOrder` | `desc` | `asc` or `desc` |

---

## Authentication Flow

```
1. POST /api/auth/register  →  account created
2. POST /api/auth/login     →  receive accessToken
3. Requests with Bearer     →  Authorization: Bearer <token>
4. GET  /api/auth/me        →  returns current user from token
```

Tokens are signed with HS256 and expire after the duration set in `JWT_EXPIRES_IN`. The payload contains `sub` (user ID) and `email`.

---

## Extending the Boilerplate

### Adding a New Module

1. Create `src/module/<name>/` with route, controller, service, repository, mapper, schemas, and types files
2. Define the Drizzle table in `src/database/schemas/<name>.table.ts`
3. Run `pnpm db:generate` to create the migration, then `pnpm db:migrate` to apply it
4. Register the new route in `src/app/app.ts`

Follow the existing `user` module as a reference implementation.

### Adding Role-Based Access Control

The JWT payload (`JwtPayload` type in `src/shared/types/`) and `authenticate` middleware are already in place. Add a `role` field to the payload and extend the middleware to check permissions per route.

---

## Deployment

Build for production:

```bash
pnpm build
node dist/index.js
```

**Environment checklist:**

- [ ] `NODE_ENV=production`
- [ ] `DATABASE_URL` points to production database
- [ ] `JWT_SECRET` is a strong, random secret (32+ characters)
- [ ] `ALLOWED_ORIGINS` contains only your frontend domains
- [ ] Migrations applied (`pnpm db:migrate`)

---

## Roadmap

- [ ] Testing setup (Vitest + Supertest)
- [x] Docker and Docker Compose configuration
- [ ] OpenAPI / Swagger documentation
- [ ] Refresh token support
- [ ] Rate limiting middleware
- [ ] Health check endpoint

---

## License

MIT
