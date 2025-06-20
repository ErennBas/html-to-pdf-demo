# Node.js 18 Alpine imajını temel al
FROM node:18-alpine

# Puppeteer için gerekli bağımlılıkları yükle
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    dumb-init

# Puppeteer'ın Chrome'u kullanması için ortam değişkenlerini ayarla
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/bin/chromium-browser

# Chrome için güvenlik ayarları
ENV CHROME_HEADLESS=true \
    CHROME_NO_SANDBOX=true \
    CHROME_DISABLE_GPU=true \
    CHROME_DISABLE_DEV_SHM_USAGE=true

# Çalışma dizinini belirle
WORKDIR /app

# package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Uygulama kodlarını kopyala
COPY . .

# Port 3000'i expose et
EXPOSE 3000

# dumb-init ile uygulamayı başlat (daha iyi process yönetimi)
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"] 