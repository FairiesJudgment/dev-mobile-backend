# Utilisation de l'image Node 22 officielle
FROM node:22

# Définition du répertoire de travail
WORKDIR /app

# Définition de l'environnement en production
ENV NODE_ENV=production

# Installation globale de NestJS CLI
RUN npm install -g @nestjs/cli

# Copier uniquement les fichiers package.json et lock pour optimiser le cache Docker
COPY package*.json ./

# Installation des dépendances en production uniquement
RUN npm install --only=production

# Copier le reste du code (après l'installation pour ne pas invalider le cache)
COPY . .

# Copier le dossier Prisma (si ce n'est pas déjà couvert par COPY . .)
COPY prisma ./prisma

# Exposition du port (⚠️ Heroku ignore cette directive, mais c'est une bonne pratique)
#EXPOSE 8240

# Commande de démarrage
CMD ["npm", "run", "start:prod"]
