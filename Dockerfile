FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --production=false

# Copy application code
COPY . .

# Build frontend
RUN npm run build

# Create db directory
RUN mkdir -p /db

# Expose port
EXPOSE 9993

# Set environment variables
ENV NODE_ENV=production
ENV DB_PATH=/db/pietracker.db
ENV PORT=9993

# Start application
CMD ["node", "server/index.js"]
