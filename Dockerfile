# Steg 1: Bygg appen

FROM node:20-alpine AS builder

WORKDIR /app



# Kopiera package-filerna och installera beroenden

COPY package*.json ./

RUN npm ci



# Kopiera resten av koden och bygg

COPY . .

RUN npm run build



# Steg 2: Servera appen

FROM node:20-alpine

WORKDIR /app



# Installera en enkel webbserver

RUN npm install -g serve



# Kopiera den färdiga 'dist'-mappen från bygg-steget

COPY --from=builder /app/dist ./dist



# Viktigt: Lyssna på port 8080 (Google Cloud Runs standard)

ENV PORT=8080

EXPOSE 8080



# Starta servern

CMD ["sh", "-c", "serve -s dist -l tcp://0.0.0.0:$PORT"]