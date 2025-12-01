# backend/Dockerfile

# Använd en lättviktig Python-version
FROM python:3.11-slim

# Sätt arbetskatalogen i containern
WORKDIR /app

# Kopiera requirements och installera beroenden
# --no-cache-dir håller filen liten och snabb
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Kopiera resten av backend-koden
COPY . .

# Starta servern med Python.
# Din main.py har redan kod längst ner som läser av rätt PORT från Google.
CMD ["python", "main.py"]