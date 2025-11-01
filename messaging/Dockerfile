FROM node:22-alpine3.18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4000

CMD ["nodemon", "index.js"]
