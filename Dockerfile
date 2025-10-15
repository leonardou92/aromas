FROM node:18-alpine

WORKDIR /app

# Copiar package.json y package-lock si existe
COPY package.json package-lock.json* ./

# Instalar dependencias en modo production
RUN npm ci --production || npm install --production

# Copiar el resto del código
COPY . .

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "src/server.js"]
# Dockerfile for Aromas backend
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json package-lock.json* ./
RUN npm ci --production || npm install --production

# Copy source
COPY . .

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "src/server.js"]
