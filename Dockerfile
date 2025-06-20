FROM oven/bun:alpine

# Chromium ve gerekli fontları Alpine için kur
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ttf-freefont \
    ca-certificates \
    dbus \
    expat \
    fontconfig \
    glib \
    gtk+3.0 \
    libx11 \
    libxcomposite \
    libxcursor \
    libxdamage \
    libxext \
    libxi \
    libxrandr \
    libxrender \
    libxtst \
    cups \
    alsa-lib \
    at-spi2-core \
    cairo \
    pango \
    gdk-pixbuf \
    && mkdir /app

WORKDIR /app

# Puppeteer için gerekli ortam değişkenleri
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV CHROME_BIN=/usr/bin/chromium-browser
ENV CHROME_PATH=/usr/lib/chromium/


# Node kullanıcısını oluştur ve Puppeteer için gerekli izinleri ayarla
RUN addgroup -S node && \
    adduser -S node -G node && \
    mkdir -p /home/node && \
    chown -R node:node /home/node && \
    chmod -R 777 /home/node && \
    mkdir -p /tmp/puppeteer && \
    chmod -R 777 /tmp/puppeteer

# Paket dosyalarını kopyala ve bağımlılıkları yükle
COPY package.json bun.lockb* ./
RUN bun install

# Kaynak kodunu kopyala
COPY . .

# Portu aç
EXPOSE 4000

# Uygulamayı başlat
CMD ["bun", "index.js"]