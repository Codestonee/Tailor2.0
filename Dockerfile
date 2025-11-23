# Använd en lättviktig Python-version
FROM python:3.11-slim

# 1. Installera ALLA systemberoenden på en gång
# (Magic för filtyper + Tesseract för OCR + Svenska/Engelska språkpaket)
RUN apt-get update && apt-get install -y \
    libmagic1 \
    tesseract-ocr \
    tesseract-ocr-swe \
    tesseract-ocr-eng \
    && rm -rf /var/lib/apt/lists/*

# Sätt arbetskatalogen
WORKDIR /app

# 2. Kopiera requirements och installera Python-paket
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 3. Kopiera hela app-mappen
COPY app ./app

# Exponera porten
EXPOSE 8080

# 4. Startkommando
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]