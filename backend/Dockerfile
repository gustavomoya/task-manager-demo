FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npm run db:test:create && npm run db:test:migrate && npm run typeorm -- migration:run -d src/database/data-source.ts && npm run start:prod"]
