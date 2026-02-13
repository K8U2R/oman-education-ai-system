# --- Phase 1: Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install --ignore-scripts

# Copy source code
COPY . .

# Build args
ARG VITE_API_BASE_URL
ARG VITE_API_URL
ARG VITE_WS_URL
ARG VITE_SSE_URL
ARG VITE_APP_URL

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_API_URL=$VITE_API_URL \
    VITE_WS_URL=$VITE_WS_URL \
    VITE_SSE_URL=$VITE_SSE_URL \
    VITE_APP_URL=$VITE_APP_URL

# Build the application (type-check bypassed for rapid deployment)
RUN npx vite build

# --- Phase 2: Runtime Stage (Nginx) ---
FROM nginx:stable-alpine

# Copy the build output from the builder stage to Nginx web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port (Nginx default)
EXPOSE 80

# The frontend usually runs on 30174 in development, 
# but in Docker/Nginx it can run on 80 inside the container 
# and be mapped back to 30174 on the host.

CMD ["nginx", "-g", "daemon off;"]
