# Node.js 18 Alpine imajını temel al
FROM node:18-alpine

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