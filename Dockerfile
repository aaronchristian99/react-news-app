# Base image
FROM node:14-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the React project
RUN npm run build

# Expose the port (change it if needed)
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
