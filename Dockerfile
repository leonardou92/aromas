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

# Use the start script defined in package.json
CMD ["npm", "start"]
