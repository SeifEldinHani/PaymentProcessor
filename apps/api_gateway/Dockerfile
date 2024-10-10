FROM node:16 AS base

WORKDIR /

COPY package*.json ./
COPY tsconfig.json ./
COPY proto ./proto
COPY ./apps/api_gateway ./

RUN npm install

RUN npm run build 
