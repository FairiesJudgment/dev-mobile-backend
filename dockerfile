FROM node:22

WORKDIR /awi-backend

RUN npm install -g @nestjs/cli

COPY package*.json ./

RUN npm install

COPY . .

COPY prisma ./prisma

EXPOSE 8240

ENTRYPOINT ["npm", "run", "start:prod"]
