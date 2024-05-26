# Stage 1
FROM node:latest AS base

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json .
RUN npm install

ENV PORT 5000
EXPOSE $PORT
COPY . .

RUN npm run build

#Stage 2
FROM base AS development
CMD ["npm","run","dev"]

#Stage 3
FROM base AS production
WORKDIR /app
# RUN npm install typescript
COPY --from=base app/server/dist ./server/dist
RUN npm prune --production
CMD ["npm","run","start"]
