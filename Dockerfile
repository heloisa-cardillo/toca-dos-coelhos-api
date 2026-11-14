# Etapa 1: instala as dependências de produção (a imagem completa tem os compiladores)
FROM node:22 AS dependencias
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Etapa 2: imagem final, leve, só com o que a aplicação precisa para rodar
FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
ENV DB_ARQUIVO=/app/dados/toca.db

COPY --from=dependencias /app/node_modules ./node_modules
COPY package.json ./
COPY dist/ ./dist/
COPY db/ ./db/
RUN mkdir dados && chown node:node dados

USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]