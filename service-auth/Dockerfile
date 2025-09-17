# -----------------------------
# Stage 1: Build
# -----------------------------

FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

# -----------------------------
# Stage 2: Production
# -----------------------------

FROM node:20-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /usr/src/app/tsconfig.json ./tsconfig.json

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD npm run db:push && npm start