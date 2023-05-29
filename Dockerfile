# Base image
FROM node:14-alpine

# Set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose the port (change it if needed)
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
