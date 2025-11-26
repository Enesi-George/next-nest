FROM node:18-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all source code
COPY . .

# Debug: Check if service account file exists and list directory
RUN echo "=== Debug: Checking files in /app ===" && \
    ls -la /app/ && \
    echo "=== Debug: Checking for service-account.json ===" && \
    if [ -f "/app/service-account.json" ]; then \
        echo "service-account.json exists and is a file" && \
        echo "File size: $(stat -c%s /app/service-account.json) bytes" && \
        echo "First 100 chars: $(head -c 100 /app/service-account.json)"; \
    else \
        echo "service-account.json does NOT exist or is not a file"; \
    fi

# Build the application
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]