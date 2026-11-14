FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
ENV DB_ARQUIVO=/app/dados/toca.db

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY dist/ ./dist/
COPY db/ ./db/
RUN mkdir dados && chown node:node dados

USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]