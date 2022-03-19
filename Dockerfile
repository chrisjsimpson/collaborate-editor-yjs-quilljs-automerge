FROM node:17-alpine AS builder
WORKDIR /usr/local/apache2/htdocs
COPY . .
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm install --production
RUN npm run dist

FROM httpd:alpine3.15

COPY . /usr/local/apache2/htdocs/

EXPOSE 8080
