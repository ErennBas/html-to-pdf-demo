# Ubuntu 22.04 LTS tabanlı imaj kullan
FROM ubuntu:22.04

# Sistem paketlerini güncelle ve gerekli bağımlılıkları yükle
RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libxss1 \
    libxtst6 \
    xvfb \
    && rm -rf /var/lib/apt/lists/*

# Node.js 18 LTS'i yükle
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@latest

# Google Chrome'u yükle
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Puppeteer için gerekli ortam değişkenleri
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
ENV CHROME_BIN=/usr/bin/google-chrome-stable
ENV CHROME_PATH=/usr/bin/google-chrome-stable

# Çalışma dizinini oluştur
WORKDIR /app

# Puppeteer için geçici dizin oluştur
RUN mkdir -p /tmp/puppeteer && chmod -R 777 /tmp/puppeteer

# Paket dosyalarını kopyala ve bağımlılıkları yükle
COPY package*.json ./
RUN npm ci --only=production

# Kaynak kodunu kopyala
COPY . .

# Portu aç
EXPOSE 3000

# Uygulamayı başlat
CMD ["npm", "start"]