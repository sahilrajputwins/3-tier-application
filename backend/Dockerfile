FROM node
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install dotenv

# Copy the rest of the application code
COPY . .

# Set environment variables
EXPOSE 3500

# Start the application
CMD ["node", "server.js"]

