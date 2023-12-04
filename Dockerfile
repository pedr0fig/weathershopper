FROM node:20.10.0-alpine

LABEL maintainer="pedr0fig"

RUN apk --no-cache add bash

ENV APP_DIR /app/
RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}

COPY package.json package-lock.json ${APP_DIR}
RUN npm ci
COPY . ${APP_DIR}
