FROM node:22

WORKDIR /awi-backend

COPY package*.json ./

RUN npm install

COPY . .

COPY prisma ./prisma

EXPOSE 8000

ENTRYPOINT ["npm", "run", "start:prod"]
