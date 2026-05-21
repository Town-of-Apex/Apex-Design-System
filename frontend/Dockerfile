FROM node:22-alpine

WORKDIR /app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose Vite's default dev server port
EXPOSE 5173

# Start the Vite dev server with host binding so it's accessible outside the container
CMD ["npm", "run", "dev", "--", "--host"]
