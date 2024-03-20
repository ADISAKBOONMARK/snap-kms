# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /snap

# Copy all files from the current directory to the working directory
COPY ./.depcheckrc.json ./.depcheckrc.json
COPY ./.eslintrc.js ./.eslintrc.js     
COPY ./images ./images                                     
COPY ./snap.config.ts ./snap.config.ts
COPY ./snap.manifest.json ./snap.manifest.json
COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json 

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock

# Fix arm64 timeouts
# RUN yarn config set network-timeout 300000 && yarn global add node-gyp

# Install dependencies
RUN yarn install

# Expose port 8080
EXPOSE 8080

# Start the Express server
CMD ["yarn", "static-serve"]