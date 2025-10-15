FROM node:20-alpine


# Copy package manifest first for cached installs
COPY package.json package-lock.json* ./

# Install production dependencies
RUN npm ci --production || npm install --production

# Copy application source
COPY . .

ENV NODE_ENV=production
EXPOSE 3000

# Start the app using absolute path to avoid relative path issues in some runtimes
CMD ["node", "/app/src/app.js"]
