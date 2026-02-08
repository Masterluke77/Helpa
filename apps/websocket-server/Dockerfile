FROM node:18-alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=websocket-server --docker

FROM base AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm install

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
COPY tsconfig.json tsconfig.json

# Build directly to avoid turbo issues
WORKDIR /app/apps/websocket-server
RUN npm run build
WORKDIR /app

FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs
USER expressjs

COPY --from=installer /app/apps/websocket-server/dist ./dist
COPY --from=installer /app/apps/websocket-server/package.json .
COPY --from=installer /app/node_modules ./node_modules

CMD node dist/index.js
