FROM node:16 AS base

WORKDIR /

COPY package*.json ./
COPY tsconfig.json ./
COPY proto ./proto
COPY wait-for-it.sh ./

COPY ./apps/payment_processor/.sequelizerc ./
COPY ./apps/payment_processor ./
RUN chmod +x /wait-for-it.sh


RUN npm install

RUN npm run build 



