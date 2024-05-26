#Stage 1
FROM node:latest AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

#Stage 2

FROM base AS build
RUN npm run build

#Stage 3
FROM base AS development
WORKDIR /app
ENV PORT=3000
EXPOSE $PORT
CMD ["npm", "run", "dev"]

#Stage 4
# FROM base AS productions
# WORKDIR /app
# RUN npm install -g serve
# COPY --from=build /app/dist ./dist
# ENV PORT=3000
# EXPOSE $PORT
# CMD ["serve", "-s", "dist", "-l", "3000"]

FROM nginx:latest as production
WORKDIR /usr/share/nginx/html
RUN apt-get update && apt-get install -y certbot python3-certbot-nginx vim
RUN rm /etc/nginx/conf.d/*
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html/dist
COPY --from=base /app/nginx/default.conf /etc/nginx/conf.d/
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]




