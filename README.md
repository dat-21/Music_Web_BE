# Music Web - Backend (BE)

## 📌 Giới thiệu dự án

Hệ thống Backend cho nền tảng nghe nhạc trực tuyến, cung cấp API mạnh mẽ để quản lý âm nhạc, người dùng và tích hợp AI. Dự án được xây dựng với kiến trúc hướng dịch vụ, đảm bảo tính mở rộng và bảo mật cao.

## 🚀 Công nghệ sử dụng

Dự án được xây dựng trên nền tảng **Node.js** hiện đại với các thư viện hàng đầu:

- **Ngôn ngữ:** TypeScript (đảm bảo type-safety)
- **Framework:** Express.js (v5.1.0)
- **Cơ sở dữ liệu:** MongoDB (với Mongoose ODM)
- **Xác thực:** JSON Web Token (JWT) & bcryptjs
- **Trí tuệ nhân tạo (AI):** Google Generative AI (Gemini Pro) integration
- **Lưu trữ tệp:** Cloudinary API (lưu trữ nhạc và hình ảnh)
- **Xử lý Metadata:** music-metadata (phân tích tệp âm thanh)
- **Validation:** Zod (schema validation)
- **Tiện ích:** Axios, Multer, Cookie-parser, Slugify, Dotenv

## ✨ Các tính năng chính

- **Xác thực người dùng:** Đăng ký, đăng nhập và quản lý phiên làm việc bảo mật với JWT và HTTP-only cookies.
- **Quản lý âm nhạc:**
  - Tải lên (Upload) nhạc lên Cloudinary với tự động trích xuất metadata (tên bài hát, ca sĩ, ảnh bìa).
  - Quản lý bài hát, danh sách phát (Playlists).
  - Phân quyền người dùng (User, Moderator, Admin).
- **AI Chatbot:** Tích hợp Gemini AI để hỗ trợ người dùng tìm kiếm nhạc, tư vấn và giải đáp thắc mắc.
- **Lịch sử hoạt động:** Lưu trữ lịch sử nghe nhạc và các tương tác của người dùng.
- **Admin Dashboard API:** Các endpoint dành riêng cho quản trị viên để quản lý toàn bộ hệ thống (người dùng, bài hát, báo cáo).

## 📁 Cấu trúc thư mục

```text
src/
├── config/         # Cấu hình hệ thống (DB, Cloudinary, Gemini)
├── controllers/    # Xử lý logic cho các request
├── enums/          # Định nghĩa các hằng số, kiểu enum
├── middleware/     # Các hàm trung gian (Auth, Error handling, Upload)
├── models/         # Định nghĩa Schema cho MongoDB
├── repositories/    # Lớp truyền dữ liệu (Data access layer)
├── routes/         # Định nghĩa các endpoint API
├── services/       # Logic nghiệp vụ (với AI Service, Music Service)
├── types/          # Định nghĩa interface và type TypeScript
├── utils/          # Các hàm tiện ích dùng chung
├── validations/    # Các schema Zod để kiểm tra dữ liệu đầu vào
└── server.ts       # Điểm khởi chạy của server
```

## 🛠️ Hướng dẫn cài đặt

### 1. Yêu cầu hệ thống

- Node.js (phiên bản 18 trở lên)
- MongoDB account (hoặc MongoDB Compass)
- Cloudinary account
- Google AI API Key (cho Gemini)

### 2. Các bước cài đặt

1. **Clone dự án:**

   ```bash
   git clone <repo-url>
   cd backend
   ```

2. **Cài đặt thư viện:**

   ```bash
   npm install
   ```

3. **Cấu hình môi trường:**
   Tạo tệp `.env` tại thư mục gốc và nhập các thông tin sau:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   GEMINI_API_KEY=your_google_ai_key
   ```

4. **Chạy dự án:**
   - Chế độ phát triển: `npm run dev`
   - Chế độ Production: `npm run build && npm start`

## 🔗 Danh mục API quan trọng

- `/api/auth`: `POST /login`, `POST /register`, `GET /logout`
- `/api/music/public`: Truy cập công khai (tìm kiếm, xem bài hát)
- `/api/music/user`: Cho người dùng đã đăng nhập (playlist, yêu thích)
- `/api/music/admin`: Dành riêng cho quản trị viên (duyệt nhạc, xóa nội dung)
- `/api/ai-chatbot`: Gửi tin nhắn và nhận phản hồi từ Gemini

---
*Dự án đang trong quá trình phát triển và hoàn thiện các tính năng nâng cao.*
