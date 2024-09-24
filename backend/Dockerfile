# Use a lightweight Node.js image based on Alpine with stable version 20
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --no-optional

# Install nodemon locally as a development dependency
RUN npm install nodemon --save-dev

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the Express app runs on (5000)
EXPOSE 5000

# Start the Node.js application using npm
CMD ["npm", "run", "dev"]
