# Use a Node.js image as the base
FROM node:alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the Vue app files
COPY . .

# Expose the port
EXPOSE 8080

# Command to run the Vue app
CMD ["npm", "run", "serve"]