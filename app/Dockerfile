FROM node:20-alpine

WORKDIR /app

# Solo copiamos lo necesario — sin package.json porque no hay dependencias externas
COPY server.js .

EXPOSE 3000

CMD ["node", "server.js"]
