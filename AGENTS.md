# AGENTS.md — Express TypeScript Boilerplate

## Project Overview

Production-ready REST API boilerplate using **Express 5**, **TypeScript** (strict), **Drizzle ORM**, **PostgreSQL**, **Zod**, **JWT**, **Argon2**, and **Pino**.

---

## Architecture

Layered architecture with strict one-way dependency flow:

```
Route → Controller → Service → Repository → Drizzle ORM
```

- **Route**: registers Express handlers, applies middleware
- **Controller**: validates input (Zod), calls service, returns HTTP response
- **Service**: business logic, throws domain exceptions
- **Repository**: DB queries only, returns raw entities or null
- **Mapper**: pure functions, entity → response type transformation

**Shared layer** (`src/shared/`): cross-cutting concerns used by any layer — exceptions, middleware, utils, types, constants.

---

## File & Folder Conventions

| Concern | Convention |
|---|---|
| File names | `kebab-case` |
| Variables, functions | `camelCase` |
| Classes, types, interfaces | `PascalCase` |
| Constants | `UPPER_SNAKE_CASE` |
| Namespaces/object groupings | `camelCase` namespace object pattern |

### Module Structure

Every feature module lives under `src/module/<name>/` and follows this exact shape:

```
module/
├── module.route.ts
├── module.controller.ts
├── module.service.ts
├── module.repository.ts       # omit if no DB access
├── module.mapper.ts           # omit if no data transformation
├── schemas/
│   ├── create-module.schema.ts
│   ├── update-module.schema.ts
│   └── query-module.schema.ts
└── types/
    ├── module.type.ts
    └── module-response.type.ts
```

### Src Layout

```
src/
├── app/          # Express app setup (app.ts) and server bootstrap (server.ts)
├── config/       # Application configuration
├── database/     # Drizzle client, table schemas, migrations, seeders
├── module/       # Feature modules
├── shared/       # constants/, exceptions/, middlewares/, schemas/, types/, utils/
└── index.ts      # Entry point — imports server only
```

---

## Coding Standards

### TypeScript

- Strict mode is enforced — no `any`, no unused vars/params, no implicit returns.
- Infer types from Zod schemas and Drizzle table definitions — do not duplicate type declarations.
- Path alias `@/` maps to `src/` — always use it for imports.

### Validation

- Validate all external input (request body, params, query) with Zod in the **controller**.
- Extend `baseQuerySchema` for list endpoints; use `uuidParamSchema` for `:id` params.
- Never validate internal function arguments — trust the type system.

### HTTP Responses

Use `httpResponseUtil` functions exclusively. Do not construct response objects manually.

| Scenario | Utility |
|---|---|
| Single resource | `successResponse(res, data, status?)` |
| Paginated list | `paginatedResponse(res, data, meta)` |
| Created resource | `successResponse(res, data, 201)` |

**Success shape:**
```json
{ "success": true, "statusCode": 200, "data": {}, "message": "optional" }
```

**Paginated shape:**
```json
{ "success": true, "statusCode": 200, "data": [], "meta": { "total", "page", "limit", "totalPages" } }
```

**Error shape** (emitted by error-handler middleware):
```json
{ "success": false, "statusCode": 400, "message": "Bad Request", "errors": {} }
```

### Error Handling

- Throw domain exceptions from the **service** layer only.
- Never throw raw `Error` for expected business errors.
- Available exceptions in `src/shared/exceptions/`:
  - `BadRequestException` → 400
  - `UnauthorizedException` → 401
  - `ForbiddenException` → 403
  - `NotFoundException` → 404
  - `ConflictException` → 409
- Unknown/unexpected errors bubble to global handler → 500.
- Do not add try-catch in controllers for domain errors — the global handler covers it.

### Controllers

```typescript
// Pattern: validate → call service → respond
export const UserController = {
  create: async (req: Request, res: Response) => {
    const body = createUserSchema.parse(req.body);
    const user = await UserService.create(body);
    successResponse(res, user, 201);
  }
};
```

- Export as a namespace object (`export const XController = { ... }`).
- Each method is `async (req, res) => void`.
- No business logic in controllers.

### Services

- Export as a namespace object (`export const XService = { ... }`).
- Hash passwords with `passwordUtil.hash()` (Argon2id).
- Use mapper before returning data to the controller.
- All methods must be `async`.

### Repositories

- Export as a namespace object (`export const XRepository = { ... }`).
- Return raw Drizzle entity types or `null` — never throw from a repository.
- No business logic, no exception throwing.
- Pagination: use `calcOffset(page, limit)` from `paginationUtil`.

### Mappers

- Pure functions only — no side effects, no async.
- Never expose `password` in response types unless explicitly named `WithPassword`.

---

## Database Rules

- ORM: **Drizzle ORM** with PostgreSQL (`pg` driver).
- Table schemas live in `src/database/schemas/<name>.table.ts`.
- Always include `createdAt` and `updatedAt` using `timestampUtil` helpers.
- Use UUID primary keys: `id: uuid('id').defaultRandom().primaryKey()`.
- Generate migrations with `pnpm db:generate` — never edit migration files manually.
- Apply with `pnpm db:migrate` (production-safe) or `pnpm db:push` (dev only).
- Seeders go in `src/database/seeders/` and are orchestrated via `index.seeder.ts`.

---

## Authentication & Security

- JWT signed with HS256. Payload: `{ sub: userId, email }`.
- Protect routes by passing `authenticate` middleware in the route file.
- Access `req.user` (typed as `JwtPayload`) only in controllers/services — never in repositories.
- Passwords hashed with `passwordUtil.hash()`. Verified with `passwordUtil.verify()`.
- Security headers applied globally via Helmet.
- CORS: configured from `ALLOWED_ORIGINS` env var (comma-separated).

---

## Environment & Config

- All env vars validated at startup via Zod in `src/config/env.config.ts`.
- Add new env vars to the Zod schema and `.env.example` — never access `process.env` directly elsewhere.
- Grouped config export: `config.app`, `config.db`, `config.auth`, `config.logging`.

**Required env vars:**
```
APP_URL, ALLOWED_ORIGINS, NODE_ENV, PORT
DATABASE_URL, JWT_SECRET, JWT_EXPIRES_IN, LOG_LEVEL
```

---

## API Conventions

- Base path: `/api/<resource>` (plural, kebab-case).
- Standard REST verbs: `POST /`, `GET /`, `GET /:id`, `PATCH /:id`, `DELETE /:id`.
- Always validate `:id` params with `uuidParamSchema`.
- List endpoints must support pagination via `baseQuerySchema` (`page`, `limit`, `search`, `sortBy`, `sortOrder`).
- Sort column whitelisting must be enforced in repository/schema to prevent SQL injection.

---

## Logging

- Logger: **Pino**. Import from `src/shared/utils/logger.util.ts` — never use `console.log`.
- Dev: pretty-printed. Production: JSON.
- Log level from `LOG_LEVEL` env var (default: `info`).
- HTTP requests auto-logged by `http-logger.middleware.ts` — do not duplicate request logging.
- Log errors at `error` level for 5xx; `warn` for 4xx in the error handler.

---

## Build & Tooling

| Command | Purpose |
|---|---|
| `pnpm dev` | Dev server with hot reload (`tsx watch`) |
| `pnpm build` | Production build via `tsup` (ESM, minified) |
| `pnpm start` | Run compiled output |
| `pnpm lint` | ESLint check |
| `pnpm lint:fix` | ESLint autofix |
| `pnpm format` | Prettier format |
| `pnpm db:generate` | Generate Drizzle migration |
| `pnpm db:migrate` | Apply migrations |
| `pnpm db:push` | Push schema directly (dev only) |
| `pnpm db:seed` | Run seeders |
| `pnpm db:studio` | Open Drizzle Studio |

---

## Dependency Management

- Package manager: **pnpm** (inferred from lockfile conventions — do not use npm/yarn).
- Do not add dependencies without a clear justification.
- Prefer packages already in the stack before adding new ones.
- Never install `@types/*` for packages that ship their own types.
- Runtime deps go to `dependencies`; tooling/build-only goes to `devDependencies`.

---

## Adding a New Module — Checklist

- [ ] Create `src/module/<name>/` directory with all required files
- [ ] Define Drizzle table in `src/database/schemas/<name>.table.ts`
- [ ] Run `pnpm db:generate` and commit the migration
- [ ] Add Zod schemas (create, update, query extending `baseQuerySchema`)
- [ ] Infer types from Zod and Drizzle — no manual duplication
- [ ] Repository returns raw entities, never throws
- [ ] Service handles all business logic, throws domain exceptions
- [ ] Controller validates input, calls service, uses `httpResponseUtil`
- [ ] Mapper strips sensitive fields, transforms entity → response type
- [ ] Register route in `src/app/app.ts`
- [ ] Update `.env.example` if new env vars are required

---

## Forbidden Actions

- Do **not** access `process.env` outside `env.config.ts`.
- Do **not** use `console.log` — use the Pino logger.
- Do **not** return raw Drizzle entities from controllers — always map first.
- Do **not** expose `password` field in any response (except `UserWithPassword` internal type).
- Do **not** write business logic in controllers or repositories.
- Do **not** edit Drizzle-generated migration files manually.
- Do **not** use `db:push` in production.
- Do **not** add `any` types — fix the underlying type issue instead.
- Do **not** bypass Zod validation for external inputs.
- Do **not** throw from repositories — return `null` for not-found cases.

---

## Pre-Completion Checklist

Before marking any task done:

- [ ] TypeScript compiles without errors (`pnpm build`)
- [ ] Lint passes (`pnpm lint`)
- [ ] No `any` types introduced
- [ ] All external inputs validated with Zod
- [ ] Responses use `httpResponseUtil` — correct shape
- [ ] New env vars added to schema and `.env.example`
- [ ] New DB tables have a migration generated
- [ ] No sensitive data (passwords, secrets) leaked in responses or logs
- [ ] Module registered in `app.ts` if a new route was added
