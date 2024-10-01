# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the working directory inside the container
COPY . .

# Build the app
RUN npm run build

# Expose the port that NestJS will run on
EXPOSE 3000

# Define the command to start the app
CMD ["npm", "run", "start:prod"]
