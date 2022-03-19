FROM node:17-alpine AS builder
WORKDIR /usr/local/apache2/htdocs
COPY . .
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm install --production
RUN npm run dist

FROM httpd:alpine3.15

COPY --from=builder /usr/local/apache2/htdocs/dist /usr/local/apache2/htdocs/dist

COPY . /usr/local/apache2/htdocs/

ARG WEBSOCKET_ADDRESS=hellohello

ENV WEBSOCKET_ADDRESS=${WEBSOCKET_ADDRESS}

RUN sed -i.bak "s/ws:\/\/127.0.0.1:1234/$WEBSOCKET_ADDRESS/g" /usr/local/apache2/htdocs/quill.js

EXPOSE 80
