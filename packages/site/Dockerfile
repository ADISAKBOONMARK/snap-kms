# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy all files from the current directory to the working directory
COPY ./fonts ./fonts
COPY ./src ./src
COPY ./static ./static
COPY ./.depcheckrc.json ./.depcheckrc.json
COPY ./.env.production ./.env.production
COPY ./.eslintrc.js ./.eslintrc.js
COPY ./.prettierignore ./.prettierignore
COPY ./gatsby-browser.tsx ./gatsby-browser.tsx
COPY ./gatsby-config.ts ./gatsby-config.ts
COPY ./gatsby-node.js ./gatsby-node.js
COPY ./gatsby-ssr.tsx ./gatsby-ssr.tsx
COPY ./server.js ./server.js
COPY ./tsconfig.json ./tsconfig.json

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock

# Fix arm64 timeouts
# RUN yarn config set network-timeout 300000 && yarn global add node-gyp

# Install dependencies
RUN yarn install

# Expose port 3000
EXPOSE 3000

# Start the Express server
CMD ["yarn", "static-serve"]