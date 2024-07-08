# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /app

# First, copy over package.json, and then install production dependencies
COPY --from=build /app/package*.json ./
RUN npm install --only=production

# Now copy the built JavaScript files
COPY --from=build /app/dist ./dist

EXPOSE 7000

CMD ["npm", "run", "start"]