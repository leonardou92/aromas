# Use Node 20 on Alpine and set working directory to /app so files are placed in /app
FROM node:20-alpine

WORKDIR /app

# Copy package manifest first for cached installs
COPY package.json package-lock.json* ./

# Install production dependencies
RUN npm ci --production || npm install --production

# Copy application source
COPY . .

ENV NODE_ENV=production
EXPOSE 3000

# Start the app using the server at repository root (present in /app)
CMD ["node", "server.js"]
