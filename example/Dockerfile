FROM node:latest as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm --registry=https://registry.npm.taobao.org install
COPY ./ .
RUN npm run build

FROM nginx as production-stage
ARG publicPath=/
RUN mkdir -p /app${publicPath}
COPY --from=build-stage /app/dist /app${publicPath}
COPY nginx.conf /etc/nginx/nginx.conf