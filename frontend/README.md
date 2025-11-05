# Frontend — Expo App

## Cài đặt

Mở terminal tại thư mục `frontend` và cài dependencies:

```powershell
cd d:\postgresql\mid-term\frontend
npm install
# hoặc
# yarn install
```

## Cấu hình

- Nếu app gọi API backend, chỉnh `BASE_URL` trong `src/api/api.js` (hoặc sử dụng biến môi trường) cho trỏ tới server backend, ví dụ `http://localhost:5000` hoặc `http://<your-ip>:5000` khi chạy trên thiết bị di động.

## Chạy app

- Khởi động Expo:

```powershell
npx expo start
# hoặc
npm start
```

- Mở app trên thiết bị bằng Expo Go (scan QR) hoặc trên emulator/simulator theo hướng dẫn Expo.

## Kiểm thử nhanh

- Đảm bảo backend đang chạy (ví dụ `http://localhost:5000`).
- Mở app, vào màn hình quản trị (Admin) và thử tạo/cập nhật user, upload ảnh.

## Lưu ý

- Nếu dùng thiết bị thật, thay `localhost` bằng IP máy tính trong `BASE_URL`.
- Cần Node.js và Expo CLI để phát triển; versions ổn định (Node 14+).

