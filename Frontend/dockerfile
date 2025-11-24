# Använd en lättviktig Node.js-image
FROM node:20-alpine

# Sätt arbetskatalog
WORKDIR /app

# Kopiera paketfiler och installera beroenden
COPY package.json package-lock.json ./
RUN npm install

# Kopiera resten av koden
COPY . .

# Bygg applikationen (om vi kör production) eller förbered dev
# För enkelhetens skull kör vi dev-servern här så det liknar din lokala miljö
EXPOSE 5173

# Starta servern och bind till 0.0.0.0 så Cloud Run kan nå den
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]