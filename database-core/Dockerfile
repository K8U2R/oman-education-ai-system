# --- Phase 1: Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build:bundle

# --- Phase 2: Runtime Stage ---
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
# In database-core, we need the migrations folder
COPY --from=builder /app/migrations ./migrations
COPY .env .env

EXPOSE 3001

CMD ["node", "dist/index.js"]
