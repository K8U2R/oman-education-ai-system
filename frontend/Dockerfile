# --- Phase 1: Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install --ignore-scripts

# Copy source code
COPY . .

# Build the application
RUN npm run build

# --- Phase 2: Runtime Stage (Nginx) ---
FROM nginx:stable-alpine

# Copy the build output from the builder stage to Nginx web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port (Nginx default)
EXPOSE 80

# The frontend usually runs on 30174 in development, 
# but in Docker/Nginx it can run on 80 inside the container 
# and be mapped back to 30174 on the host.

CMD ["nginx", "-g", "daemon off;"]
