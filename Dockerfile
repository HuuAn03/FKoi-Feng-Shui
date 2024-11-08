# Dockerfile cho Frontend
FROM --platform=linux/amd64 node:18-slim

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json để cài đặt dependencies trước
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép mã nguồn của ứng dụng vào container
COPY . .

# Build ứng dụng
RUN npm run build

# Cài đặt một HTTP server để phục vụ file build
RUN npm install -g serve

# Mở cổng 5173 (hoặc cổng khác nếu cần thiết)
EXPOSE 5173

# Lệnh để chạy ứng dụng
CMD ["serve", "-s", "dist", "-l", "5173"]
