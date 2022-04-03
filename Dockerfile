FROM node:14.19.0-alpine

WORKDIR /usr/app/

COPY package*.json ./

RUN npm install

EXPOSE 8080

CMD ["npm", "run", "serve"]