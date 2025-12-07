# Stage 1: Build
FROM node:22-alpine AS builder

# Устанавливаем OpenSSL и другие зависимости для сборки
RUN apk add --no-cache openssl openssl-dev libc6-compat

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 2: Runtime
FROM node:22-alpine

# Обязательно устанавливаем OpenSSL в финальный образ
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE ${PORT}

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
