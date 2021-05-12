FROM nginx:1.18.0-alpine AS base
EXPOSE 80
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d/


FROM node:12.16.2 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --only=production
COPY . ./
RUN npm run build

FROM base AS final
COPY --from=build /app/build /usr/share/nginx/html/
CMD ["nginx", "-g", "daemon off;"]