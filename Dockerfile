# Sử dụng Node.js 18
FROM node:18-alpine

# Đặt thư mục làm việc bên trong container
WORKDIR /opt/app

# Copy package.json và package-lock.json
COPY package.json package-lock.json* ./

# Cài đặt dependencies cho production
# Dùng "ci" để cài đặt nhanh và chính xác từ file lock
RUN npm install --frozen-lockfile

# Copy toàn bộ code của bạn vào
COPY . .

# Build Strapi cho production
RUN npm build

# Đặt biến môi trường cho production
ENV NODE_ENV=production

# Expose port mà Strapi chạy
EXPOSE 1337

# Lệnh khởi động Strapi
CMD ["npm", "start"]