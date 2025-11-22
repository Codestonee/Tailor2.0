# Använd en lättviktig Python-version
FROM python:3.11-slim

# Installera systemberoenden (för PyMuPDF/fitz och magic)
RUN apt-get update && apt-get install -y \
    libmagic1 \
    && rm -rf /var/lib/apt/lists/*

# Sätt arbetskatalogen
WORKDIR /app

# Kopiera requirements och installera
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Kopiera hela app-mappen
COPY app ./app

# Exponera porten
EXPOSE 8080

# Startkommando (viktigt att peka på app.main:app)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]