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
    ttf-freefont

# Puppeteer'ın Chrome'u kullanması için ortam değişkenlerini ayarla
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

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

# Uygulamayı başlat
CMD ["npm", "start"] 