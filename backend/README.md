# User Admin Backend API

## Cài đặt

```bash
npm install
```

## Cấu hình

Chỉnh sửa file `.env` với thông tin MongoDB của bạn:
```
PORT=5000
MONGO_URI=mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.mongodb.net/multiplatform_exam
```

## Chạy server

```bash
npm start
```

hoặc với nodemon (auto-restart):
```bash
npm run dev
```

## API Endpoints

### Base URL
```
http://localhost:5000
```

### User Routes

1. **GET /api/users** - Lấy danh sách tất cả users
2. **GET /api/users/:id** - Lấy thông tin 1 user
3. **POST /api/users** - Tạo user mới (với upload ảnh)
   - Body (form-data):
     - username
     - email
     - password
     - image (file)
4. **PUT /api/users/:id** - Cập nhật user (với upload ảnh)
   - Body (form-data):
     - username
     - email
     - password
     - image (file - optional)
5. **DELETE /api/users/:id** - Xóa user

### Image URL
```
http://localhost:5000/uploads/<filename>
```

## Test API với Postman/Thunder Client

### 1. Tạo user mới (POST)
- Method: POST
- URL: http://localhost:5000/api/users
- Body: form-data
  - username: john_doe
  - email: john@example.com
  - password: 123456
  - image: [chọn file ảnh]

### 2. Lấy danh sách users (GET)
- Method: GET
- URL: http://localhost:5000/api/users

### 3. Cập nhật user (PUT)
- Method: PUT
- URL: http://localhost:5000/api/users/<user_id>
- Body: form-data (tương tự POST)

### 4. Xóa user (DELETE)
- Method: DELETE
- URL: http://localhost:5000/api/users/<user_id>
