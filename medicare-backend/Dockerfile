# Use lightweight Node 20 LTS Alpine base
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=5000

# Install dependencies only
COPY package*.json ./
RUN npm ci --only=production --ignore-scripts

# Copy application source code
COPY src/ ./src/

# Non-root secure user execution
USER node

EXPOSE 5000

# Healthcheck to monitor container uptime
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

CMD ["node", "src/server.js"]
