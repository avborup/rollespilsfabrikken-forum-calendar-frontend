FROM node:12.16.1

RUN mkdir /app

WORKDIR /app

VOLUME [ "/app" ]