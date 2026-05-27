# ─── Stage 1: build ──────────────────────────────────────────────────────────
FROM node:24-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY tsconfig.json drizzle.config.ts ./
COPY src ./src

RUN pnpm build

# ─── Stage 2: runner ─────────────────────────────────────────────────────────
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# compiled app
COPY --from=builder /app/dist ./dist

# migration assets
COPY drizzle.config.ts ./
COPY src/database/migrations ./src/database/migrations
COPY src/database/schemas ./src/database/schemas

EXPOSE 8000

# Run database migrations and start the application
CMD pnpm db:migrate && node dist/index.js
