FROM node:22

WORKDIR /awi-backend

RUN npm install -g @nestjs/cli

COPY package*.json ./

RUN npm install

COPY . .

COPY prisma ./prisma

EXPOSE 8000

CMD ["npm", "run", "start:prod"]
