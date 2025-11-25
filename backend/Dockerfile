FROM python:3.11-slim

WORKDIR /app

# Installera systemberoenden (inklusive libmagic1 som saknades!)
RUN apt-get update && apt-get install -y \
    libpoppler-cpp-dev \
    poppler-utils \
    tesseract-ocr \
    libmagic1 \
    && rm -rf /var/lib/apt/lists/*

# Kopiera requirements
COPY requirements.txt .

# Installera Python-paket (no-cache för att spara plats)
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Kopiera applikationen
COPY . .

# Skapa loggmapp
RUN mkdir -p logs

# Exponera port
EXPOSE 8000

# Startkommando
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]