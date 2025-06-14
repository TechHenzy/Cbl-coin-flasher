FROM node:18-alpine

# Install git
RUN apk add --no-cache git

# Clone repo
RUN git clone https://github.com/TechHenzy/Cbl-coin-flasher /app

# Set working directory
WORKDIR /app

# Create data directory with correct permissions
RUN mkdir -p /app/data && \
    chown -R node:node /app/data && \
    chmod -R 755 /app/data

# Install dependencies
RUN npm install

# Switch to non-root user (important for security)
USER node

# Environment variables
ENV PORT=7860
ENV NODE_ENV=production

EXPOSE 7860

CMD ["node", "server.js"]
