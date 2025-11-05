# 🎓 User Admin App - Đồ án giữa kỳ

Ứng dụng quản lý Users với Backend (Node.js + MongoDB) và Frontend (React Native Expo)

---

## 📁 Cấu trúc dự án

```
mid-term/
├── backend/               # Backend API (Node.js + Express + MongoDB)
│   ├── models/
│   │   └── User.js       # MongoDB User model
│   ├── routes/
│   │   └── userRoutes.js # CRUD API routes
│   ├── uploads/          # Thư mục chứa ảnh upload
│   ├── server.js         # Main server file
│   ├── .env              # Cấu hình MongoDB
│   └── package.json
│
└── frontend/             # Frontend (React Native Expo)
    ├── src/
    │   ├── api/
    │   │   └── api.js    # HTTP client (axios)
    │   ├── components/
    │   │   └── UserItem.js
    │   └── screens/
    │       ├── AdminListScreen.js
    │       ├── AddUserScreen.js
    │       └── EditUserScreen.js
    ├── App.js            # Main app với React Navigation
    ├── app.json          # Expo config
    └── package.json
```

---

## 🚀 HƯỚNG DẪN CHẠY DỰ ÁN

### BƯỚC 1: Chạy Backend

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies (nếu chưa cài)
npm install

# Cấu hình MongoDB trong file .env
# Mở file .env và thay thế:
# MONGO_URI=mongodb+srv://yourUsername:yourPassword@cluster0.mongodb.net/multiplatform_exam

# Chạy server
npm start
```

✅ **Server sẽ chạy tại:** `http://localhost:5000`

### BƯỚC 2: Chạy Frontend

**MỞ TERMINAL MỚI** (giữ backend chạy)

```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies (nếu chưa cài)
npm install

# ⚠️ QUAN TRỌNG: Cấu hình API URL
# Mở file: src/api/api.js
# Thay đổi dòng:
# export const API_URL = "http://YOUR_IP_HERE:5000/api/users";

# Tìm IP máy tính (Windows):
ipconfig
# Copy IPv4 Address (ví dụ: 192.168.1.100)

# Chạy Expo
npx expo start
```

**Các tùy chọn chạy:**
- **Press `w`** → Chạy trên web browser
- **Press `a`** → Chạy trên Android emulator
- **Press `i`** → Chạy trên iOS simulator (chỉ macOS)
- **Scan QR** → Chạy trên điện thoại với Expo Go app

---

## 🛠️ Stack công nghệ

### Backend
- **Node.js** + **Express** - Web framework
- **MongoDB** + **Mongoose** - Database
- **Multer** - File upload middleware
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

### Frontend
- **React Native** - Mobile framework
- **Expo** - Development platform
- **React Navigation** - Screen navigation
- **Axios** - HTTP client
- **Expo Image Picker** - Upload ảnh

---

## 📡 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/users` | Lấy danh sách tất cả users |
| GET | `/api/users/:id` | Lấy thông tin 1 user |
| POST | `/api/users` | Tạo user mới (với upload ảnh) |
| PUT | `/api/users/:id` | Cập nhật user |
| DELETE | `/api/users/:id` | Xóa user |

**Image URL:** `http://localhost:5000/uploads/<filename>`

---

## ✨ Tính năng đã implement

### Backend ✅
- [x] RESTful API với Express
- [x] MongoDB connection với Mongoose
- [x] CRUD operations (Create, Read, Update, Delete)
- [x] File upload với Multer
- [x] CORS enabled
- [x] Error handling

### Frontend ✅
- [x] React Navigation giữa các màn hình
- [x] List users với FlatList
- [x] Add user với form validation
- [x] Edit user với pre-filled data
- [x] Delete user với Alert confirmation
- [x] Image picker từ thư viện
- [x] Upload ảnh lên server
- [x] Loading indicators
- [x] Pull to refresh
- [x] Email validation
- [x] Password minimum length (6 ký tự)
- [x] Responsive UI design

---

## 📱 Màn hình

### 1. AdminListScreen
- Hiển thị danh sách tất cả users
- Nút "Thêm User Mới"
- Pull to refresh
- Nút Edit và Delete cho mỗi user

### 2. AddUserScreen
- Form nhập username, email, password
- Chọn ảnh từ thư viện
- Preview ảnh đã chọn
- Validation input
- Loading indicator khi submit

### 3. EditUserScreen
- Form chỉnh sửa thông tin user
- Hiển thị ảnh hiện tại
- Có thể thay đổi ảnh mới
- Validation tương tự AddUser

---

## 🐛 Troubleshooting

### Backend không kết nối MongoDB
```bash
# Kiểm tra MONGO_URI trong .env
# Đảm bảo username/password đúng
# Kiểm tra network access trong MongoDB Atlas (cho phép IP của bạn)
```

### Frontend không kết nối Backend
```bash
# Kiểm tra backend đang chạy: http://localhost:5000
# Kiểm tra IP trong src/api/api.js
# Đảm bảo điện thoại và máy tính cùng WiFi
# Thử dùng IP thay vì localhost
```

### Lỗi upload ảnh
```bash
# Kiểm tra thư mục backend/uploads/ tồn tại
# Kiểm tra quyền truy cập thư viện ảnh trên điện thoại
# Thử ảnh nhỏ hơn (<5MB)
```

### Expo không start
```bash
# Clear cache
npx expo start -c

# Xóa node_modules và cài lại
rm -rf node_modules
npm install
```

---

## 📚 Test API với Postman/Thunder Client

### 1. GET All Users
```
GET http://localhost:5000/api/users
```

### 2. POST Create User
```
POST http://localhost:5000/api/users
Body: form-data
- username: john_doe
- email: john@example.com
- password: 123456
- image: [file]
```

### 3. PUT Update User
```
PUT http://localhost:5000/api/users/<user_id>
Body: form-data
- username: john_updated
- email: john@example.com
- password: 123456
- image: [file] (optional)
```

### 4. DELETE User
```
DELETE http://localhost:5000/api/users/<user_id>
```

---

## 🎯 Điểm nâng cao đã làm

- ✅ Validation input (email format, password length)
- ✅ Alert confirmation khi xóa
- ✅ Loading indicators
- ✅ Error handling đầy đủ
- ✅ Responsive UI/UX
- ✅ Pull to refresh
- ✅ Image preview trước khi upload
- ✅ Timestamps trong database
- ✅ RESTful API design
- ✅ Code structure rõ ràng, dễ maintain

---

## 👨‍💻 Thông tin sinh viên

**Tên:** [Tên của bạn]  
**MSSV:** [MSSV]  
**Lớp:** [Lớp]  
**Môn học:** Lập trình đa nền tảng  
**Đề tài:** User Admin App với Backend và React Native

---

## 📝 Ghi chú

- Backend phải chạy trước khi chạy Frontend
- Cần cấu hình IP đúng trong `frontend/src/api/api.js`
- MongoDB cần có internet để kết nối (nếu dùng MongoDB Atlas)
- Expo Go app cần cùng mạng WiFi với máy tính

---

**🎉 CHÚC BẠN THÀNH CÔNG!**
