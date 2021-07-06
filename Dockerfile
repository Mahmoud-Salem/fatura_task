FROM node:16

WORKDIR /home/salem/fatura

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD [ "node", "server.js" ]
