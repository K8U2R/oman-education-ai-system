# --- Phase 1: Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build:bundle

# --- Phase 2: Runtime Stage ---
FROM node:20-alpine

WORKDIR /app

# Copy production dependencies only (optimization)
COPY package*.json ./
RUN npm install --omit=dev --ignore-scripts

# Copy the build output from the builder stage
COPY --from=builder /app/dist ./dist
# Copy migrations for the migration engine to find them
COPY --from=builder /app/scripts/backend/database/migrate.ts ./scripts/backend/database/migrate.ts
# Copy env file to the runtime
COPY .env .env

# Expose the API port
EXPOSE 30000

# Start command
CMD ["node", "dist/index.js"]
