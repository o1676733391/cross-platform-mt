# User Admin App - React Native Frontend

## 📱 Cài đặt

```bash
cd frontend
npm install
```

## ⚙️ Cấu hình API

**QUAN TRỌNG:** Mở file `src/api/api.js` và thay đổi IP:

```javascript
export const API_URL = "http://YOUR_IP_HERE:5000/api/users";
```

### Cách tìm IP của máy tính:

**Windows:**
```bash
ipconfig
```
Tìm dòng `IPv4 Address` (ví dụ: `192.168.1.100`)

**Mac/Linux:**
```bash
ifconfig
```

**Ví dụ:**
- Nếu IP là `192.168.1.100`, thì: `http://192.168.1.100:5000/api/users`
- Nếu chạy trên web browser: `http://localhost:5000/api/users`

## 🚀 Chạy ứng dụng

```bash
npx expo start
```

### Các tùy chọn:

- **Press `w`** - Chạy trên web browser
- **Press `a`** - Chạy trên Android emulator
- **Press `i`** - Chạy trên iOS simulator (chỉ macOS)
- **Scan QR code** - Chạy trên điện thoại thật qua Expo Go app

## 📲 Chạy trên điện thoại thật

1. Cài đặt **Expo Go** từ App Store/Google Play
2. Đảm bảo điện thoại và máy tính cùng mạng WiFi
3. Quét mã QR từ terminal
4. Đợi app load (lần đầu sẽ hơi lâu)

## ✨ Tính năng

- ✅ Xem danh sách users
- ✅ Thêm user mới với upload ảnh
- ✅ Chỉnh sửa thông tin user
- ✅ Xóa user với xác nhận
- ✅ Validation form (email, password length)
- ✅ Loading indicators
- ✅ Pull to refresh
- ✅ Alert confirmations
- ✅ Responsive UI

## 🎨 Màn hình

1. **AdminListScreen** - Danh sách tất cả users
2. **AddUserScreen** - Form thêm user mới
3. **EditUserScreen** - Form chỉnh sửa user

## 📦 Dependencies

- `expo` - Framework chính
- `react-navigation` - Điều hướng giữa các màn hình
- `axios` - HTTP client để gọi API
- `expo-image-picker` - Chọn ảnh từ thư viện

## 🐛 Troubleshooting

### Lỗi kết nối API:
- Kiểm tra backend đang chạy: `http://localhost:5000`
- Kiểm tra IP trong `src/api/api.js` đúng chưa
- Đảm bảo điện thoại và máy tính cùng mạng WiFi

### Lỗi upload ảnh:
- Kiểm tra quyền truy cập thư viện ảnh
- Thử chọn ảnh khác (file nhỏ hơn)

### App không load:
- Clear cache: Nhấn `Shift + C` trong Expo terminal
- Restart: `Ctrl + C` rồi `npx expo start` lại
