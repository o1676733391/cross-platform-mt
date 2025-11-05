# GridFS Image Storage - Implementation Guide


Chuyển từ lưu file vào thư mục `uploads/` sang **GridFS** (lưu trực tiếp trong MongoDB).

## Technical Implementation

### 1. Storage Method
- **multer.memoryStorage()** - File được upload vào RAM buffer thay vì disk
- **GridFSBucket** - MongoDB API để lưu/đọc file lớn (>16MB BSON limit)
- **Chunking** - File tự động chia thành chunks 255KB

### 2. New Routes

#### POST `/api/users`
- Upload image → Stream to GridFS → Save ObjectId in User.image

#### PUT `/api/users/:id`
- Delete old image from GridFS (if exists)
- Upload new image → Save new ObjectId

#### DELETE `/api/users/:id`
- Delete user document
- Delete image from GridFS

#### GET `/api/files/:id`
- Stream image từ GridFS
- Set proper Content-Type
- Add cache headers (1 year)

### 3. Database Structure

**User Collection:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "password": "123456",
  "image": "507f191e810c19729de860ea",  // GridFS file ObjectId
  "createdAt": "2025-11-05T10:00:00.000Z",
  "updatedAt": "2025-11-05T10:00:00.000Z"
}
```

**GridFS Collections** (auto-created):
- `uploads.files` - File metadata
- `uploads.chunks` - File data chunks (255KB each)

Example `uploads.files`:
```json
{
  "_id": "507f191e810c19729de860ea",
  "length": 245760,
  "chunkSize": 261120,
  "uploadDate": "2025-11-05T10:00:00.000Z",
  "filename": "profile.jpg",
  "contentType": "image/jpeg",
  "metadata": {
    "originalName": "profile.jpg",
    "uploadedAt": "2025-11-05T10:00:00.000Z"
  }
}
```

---

## API Endpoints

### Base URL
- Local: `http://localhost:5000`
- Vercel: `https://cross-platform-mt.vercel.app`

### Image URL Format
```
{BASE_URL}/api/files/{fileId}
```

Example:
```
https://cross-platform-mt.vercel.app/api/files/507f191e810c19729de860ea
```

### User Response (GET /api/users)
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "password": "123456",
    "image": "https://cross-platform-mt.vercel.app/api/files/507f191e810c19729de860ea",
    "createdAt": "2025-11-05T10:00:00.000Z",
    "updatedAt": "2025-11-05T10:00:00.000Z"
  }
]
```

---

## Environment Variables

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
BASE_URL=https://cross-platform-mt.vercel.app
```

- `BASE_URL` - Used to construct full image URLs
- If not set, uses `req.protocol` + `req.get("host")`

---

## Usage Examples

### Test với Postman

#### 1. Create User with Image
```
POST http://localhost:5000/api/users
Body: form-data
- username: john_doe
- email: john@example.com
- password: 123456
- image: [select file]
```

#### 2. Get All Users
```
GET http://localhost:5000/api/users
```

Response includes full image URLs.

#### 3. View Image
```
GET http://localhost:5000/api/files/{fileId}
```

Browser will display the image directly.

#### 4. Update User Image
```
PUT http://localhost:5000/api/users/{userId}
Body: form-data
- username: john_updated
- email: john@example.com
- password: 123456
- image: [new file]
```

Old image automatically deleted from GridFS.

---

## Vercel Deployment Notes

### Connection Reuse
MongoDB connections must be reused across serverless function invocations to avoid hitting connection limits.

**Current implementation** (mongoose auto-reuses connections):
```javascript
mongoose.connect(process.env.MONGO_URI)
```

### Limitations
1. **File Size**: Max 5MB per file (configurable in multer options)
2. **Execution Time**: Vercel free tier has 10s timeout
3. **Cold Starts**: First request may be slow

### Optimization Tips
1. Use MongoDB Atlas in same region as Vercel deployment
2. Enable connection pooling:
```javascript
mongoose.connect(uri, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000
})
```
3. Add CloudFront/CDN in front of `/api/files/*` for better performance

---

## Troubleshooting

### Error: "Cannot find module 'mongodb'"
```bash
npm install mongodb
```

### Error: "GridFSBucket is not defined"
Check mongoose connection is established before using GridFS.

### Error: "File not found" when accessing `/api/files/:id`
- Verify fileId is valid ObjectId
- Check file exists in `uploads.files` collection

### Images not loading in frontend
- Check `BASE_URL` in `.env`
- Verify CORS is enabled
- Check browser console for errors

### MongoDB connection pool exhausted
- Use connection reuse pattern
- Reduce `maxPoolSize` if needed
- Check for connection leaks

---