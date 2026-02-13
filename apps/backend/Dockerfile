FROM node:20-slim

# Required for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy all files
COPY . .

# Install all dependencies (including dev for tsx)
RUN npm install

# Generate Prisma
# Generate Prisma
RUN npx prisma generate

# Expose the API portن
EXPOSE 30000

# Start directly via tsx to avoid bundling issues
CMD ["npx", "tsx", "src/index.ts"]
