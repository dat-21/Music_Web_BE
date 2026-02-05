# 🤖 SimSimi Chatbot Integration - Hướng Dẫn Đầy Đủ

## 📋 Mục Lục
1. [Tổng Quan](#tổng-quan)
2. [Chatbot Là Gì?](#chatbot-là-gì)
3. [Các File Đã Thêm/Thay Đổi](#các-file-đã-thêmthay-đổi)
4. [Cấu Trúc Hoạt Động](#cấu-trúc-hoạt-động)
5. [Hướng Dẫn Setup](#hướng-dẫn-setup)
6. [Hướng Dẫn Test](#hướng-dẫn-test)
7. [API Reference](#api-reference)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Tổng Quan

Đã tích hợp **SimSimi Chatbot API** vào dự án Music Web, cho phép người dùng trò chuyện với AI chatbot hỗ trợ 45+ ngôn ngữ.

### Công Nghệ Sử Dụng
- **Backend**: Node.js + TypeScript + Express
- **Frontend**: React + TypeScript + Vite
- **API**: SimSimi Conversation API
- **HTTP Client**: Axios

---

## 🤖 Chatbot Là Gì?

### Định Nghĩa
**Chatbot** (chat robot) là chương trình máy tính được thiết kế để **mô phỏng cuộc trò chuyện** với người dùng thông qua text hoặc voice.

### SimSimi Chatbot
- **Loại**: Rule-based + Database-driven chatbot
- **Database**: Hàng triệu cặp "Câu hỏi - Câu trả lời"
- **Cơ chế**: Tìm kiếm câu trả lời có độ tương đồng cao nhất với câu hỏi
- **Ngôn ngữ**: Hỗ trợ 45+ ngôn ngữ (Tiếng Việt, English, Korean, Japanese, etc.)

### Khác Biệt với AI Training
- ❌ **KHÔNG phải** training/huấn luyện AI
- ✅ **LÀ** sử dụng API của chatbot có sẵn
- ✅ Chỉ gửi request và nhận response
- ✅ Không cần dataset, không cần train model

### Ví Dụ Hoạt Động
```
User Input: "Xin chào"
    ↓
SimSimi API tìm trong database
    ↓
Database có: ["Xin chào" → "Chào bạn!", "Xin chào" → "Hi!", ...]
    ↓
Trả về câu có độ tương đồng cao nhất
    ↓
Bot Response: "Chào bạn! Bạn khỏe không?"
```

---

## 📁 Các File Đã Thêm/Thay Đổi

### Backend (d:\code\Project\Project\BackEnd\)

#### ✅ Files MỚI được tạo:

1. **`src/services/chatbot.service.ts`** (80 dòng)
   - **Chức năng**: Service xử lý logic gọi SimSimi API
   - **Methods**:
     - `chat()`: Gửi tin nhắn và nhận phản hồi
     - `testConnection()`: Kiểm tra kết nối API
   - **Features**:
     - Error handling
     - Timeout 10 giây
     - Validate API response
     - Support multiple languages

2. **`src/controllers/chatbot.controller.ts`** (95 dòng)
   - **Chức năng**: Controller xử lý HTTP requests
   - **Endpoints**:
     - `POST /api/chatbot/message`: Gửi tin nhắn
     - `GET /api/chatbot/test`: Test API connection
   - **Validation**:
     - Message không được rỗng
     - Language code phải đúng định dạng (2 ký tự)
     - Filter level phải từ 0.0 đến 1.0

3. **`src/routes/chatbot.routes.ts`** (13 dòng)
   - **Chức năng**: Định nghĩa routes cho chatbot
   - **Routes**:
     - `POST /message`
     - `GET /test`

#### ✏️ Files ĐÃ CHỈNH SỬA:

4. **`src/routes/index.ts`**
   - **Thay đổi**: Thêm chatbot routes vào ứng dụng
   - **Code added**:
     ```typescript
     import chatbotRoutes from "./chatbot.routes";
     app.use("/api/chatbot", chatbotRoutes);
     ```

5. **`.env`**
   - **Thêm**: 3 biến môi trường mới
     ```env
     SIMSIMI_API_KEY=your_api_key_here
     SIMSIMI_BASE_URL=http://sandbox.api.simsimi.com
     ```

6. **`package.json`**
   - **Thêm dependency**: `axios` (HTTP client)

---

### Frontend (d:\code\Project\Project\MusicWeb\)

#### ✅ Files MỚI được tạo:

7. **`src/services/chatbot.service.ts`** (65 dòng)
   - **Chức năng**: Service gọi Backend API từ React
   - **Methods**:
     - `sendMessage()`: Gửi tin nhắn
     - `testConnection()`: Test connection
   - **Features**:
     - Type-safe với TypeScript
     - Error handling
     - Auto config API URL

8. **`src/components/Chatbot.tsx`** (220+ dòng)
   - **Chức năng**: UI Component chat window
   - **Features**:
     - ✨ Floating chat button (góc dưới phải)
     - 💬 Chat window với history
     - ⌨️ Input field với enter to send
     - 🔄 Loading state với animation
     - 📱 Responsive design
     - 🎨 Beautiful UI với Tailwind CSS
   - **States**:
     - `messages`: Lịch sử chat
     - `inputMessage`: Tin nhắn đang nhập
     - `isLoading`: Đang chờ response
     - `isOpen`: Mở/đóng chat window

---

## 🔄 Cấu Trúc Hoạt Động

### Flow Diagram

```
┌─────────────────┐
│  User nhập text │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│ React Component     │
│ (Chatbot.tsx)       │
│ - Hiển thị UI       │
│ - Quản lý state     │
└────────┬────────────┘
         │ HTTP POST
         ▼
┌─────────────────────┐
│ Frontend Service    │
│ (chatbot.service)   │
│ - Gọi Backend API   │
└────────┬────────────┘
         │ POST /api/chatbot/message
         ▼
┌─────────────────────┐
│ Backend Controller  │
│ - Validate input    │
│ - Route request     │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Backend Service     │
│ - Format request    │
│ - Call SimSimi API  │
│ - Handle errors     │
└────────┬────────────┘
         │ HTTP GET
         ▼
┌─────────────────────┐
│ SimSimi API Server  │
│ - Search database   │
│ - Return response   │
└────────┬────────────┘
         │ JSON Response
         ▼
┌─────────────────────┐
│ Backend Service     │
│ - Parse response    │
│ - Return to client  │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ React Component     │
│ - Hiển thị câu trả  │
│   lời của bot       │
└─────────────────────┘
```

### Request/Response Flow

#### Request từ Frontend:
```json
POST http://localhost:5000/api/chatbot/message
{
  "message": "Xin chào",
  "languageCode": "vi",
  "filterLevel": 0.0
}
```

#### Backend gửi đến SimSimi:
```
GET http://sandbox.api.simsimi.com/request.p
?key=your_api_key
&lc=vi
&ft=0.0
&text=Xin chào
```

#### Response từ SimSimi:
```json
{
  "response": "Chào bạn! Bạn khỏe không?",
  "id": 123456,
  "result": 100,
  "msg": "OK"
}
```

#### Response trả về Frontend:
```json
{
  "success": true,
  "data": {
    "userMessage": "Xin chào",
    "botResponse": "Chào bạn! Bạn khỏe không?",
    "languageCode": "vi",
    "metadata": {
      "responseId": 123456,
      "resultCode": 100
    }
  }
}
```

---

## 🚀 Hướng Dẫn Setup

### Bước 1: Lấy SimSimi API Key

1. **Truy cập**: http://developer.simsimi.com
2. **Đăng ký** tài khoản miễn phí
3. **Chọn**: "Get Trial Key" (1,000 requests/day miễn phí)
4. **Copy** API Key

### Bước 2: Cấu Hình Backend

1. **Mở file**: `d:\code\Project\Project\BackEnd\.env`

2. **Thay thế** `your_api_key_here` bằng API key thực:
   ```env
   SIMSIMI_API_KEY=d6bbfd1b-7cb3-4cfe-87b1-261e4d210d19
   ```

3. **Kiểm tra** các biến khác:
   ```env
   SIMSIMI_BASE_URL=http://sandbox.api.simsimi.com  # Trial key
   # Hoặc
   SIMSIMI_BASE_URL=http://api.simsimi.com          # Paid key
   ```

### Bước 3: Khởi Động Backend

```bash
# Di chuyển đến thư mục Backend
cd d:\code\Project\Project\BackEnd

# Cài đặt dependencies (nếu chưa)
npm install

# Chạy development mode
npm run dev
```

**Expected Output**:
```
Server is running on port 5000
MongoDB Connected Successfully
```

### Bước 4: Cấu Hình Frontend

1. **Thêm Chatbot vào App**

   Mở file: `d:\code\Project\Project\MusicWeb\src\App.tsx`

   ```typescript
   import Chatbot from '@/components/Chatbot';

   function App() {
     return (
       <>
         {/* ... existing code ... */}
         <Chatbot />
       </>
     );
   }
   ```

2. **Kiểm tra API URL**
   
   File: `d:\code\Project\Project\MusicWeb\src\services\chatbot.service.ts`
   
   Đảm bảo:
   ```typescript
   const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
   ```

### Bước 5: Khởi Động Frontend

```bash
# Di chuyển đến thư mục Frontend
cd d:\code\Project\Project\MusicWeb

# Cài đặt dependencies (nếu chưa)
npm install

# Chạy development mode
npm run dev
```

**Expected Output**:
```
VITE ready in 500ms
➜  Local:   http://localhost:5173/
```

---

## 🧪 Hướng Dẫn Test

### Test 1: Kiểm Tra Backend API

#### Option A: Sử dụng Browser
```
Mở trình duyệt và truy cập:
http://localhost:5000/api/chatbot/test
```

**Kết quả mong đợi**:
```json
{
  "success": true,
  "message": "SimSimi API is working properly",
  "timestamp": "2026-01-12T..."
}
```

#### Option B: Sử dụng PowerShell
```powershell
# Test connection
Invoke-RestMethod -Uri "http://localhost:5000/api/chatbot/test" -Method GET

# Gửi tin nhắn
$body = @{
    message = "Xin chào"
    languageCode = "vi"
    filterLevel = 0.0
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/chatbot/message" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

#### Option C: Sử dụng Postman/Thunder Client

1. **Test Connection**
   - Method: `GET`
   - URL: `http://localhost:5000/api/chatbot/test`
   - Click "Send"

2. **Send Message**
   - Method: `POST`
   - URL: `http://localhost:5000/api/chatbot/message`
   - Headers: `Content-Type: application/json`
   - Body (JSON):
     ```json
     {
       "message": "Xin chào",
       "languageCode": "vi",
       "filterLevel": 0.0
     }
     ```

### Test 2: Kiểm Tra Frontend UI

1. **Mở trình duyệt**: http://localhost:5173

2. **Tìm icon chat** ở góc dưới bên phải màn hình (⭕ Chat icon)

3. **Click vào icon** để mở chat window

4. **Test các tình huống**:
   - ✅ Gửi tin nhắn tiếng Việt: "Xin chào"
   - ✅ Gửi tin nhắn tiếng Anh: "Hello"
   - ✅ Gửi nhiều tin nhắn liên tiếp
   - ✅ Kiểm tra loading animation
   - ✅ Kiểm tra scroll tự động
   - ✅ Đóng/mở chat window

### Test 3: Test Error Handling

1. **Tắt Backend** (Ctrl+C trong terminal backend)

2. **Gửi tin nhắn từ Frontend**

3. **Kết quả mong đợi**: Hiển thị thông báo lỗi
   ```
   "Đã có lỗi xảy ra. Vui lòng thử lại."
   ```

4. **Bật lại Backend** và test lại

### Test 4: Test Nhiều Ngôn Ngữ

**Code để test** (có thể modify `Chatbot.tsx` tạm thời):

```typescript
// Test tiếng Anh
await chatbotService.sendMessage('Hello', 'en');

// Test tiếng Hàn
await chatbotService.sendMessage('안녕하세요', 'ko');

// Test tiếng Nhật
await chatbotService.sendMessage('こんにちは', 'ja');
```

### Test 5: Performance Test

```powershell
# Gửi 10 requests liên tiếp
for ($i=1; $i -le 10; $i++) {
    Write-Host "Request $i"
    $body = @{
        message = "Test message $i"
        languageCode = "vi"
    } | ConvertTo-Json
    
    Invoke-RestMethod -Uri "http://localhost:5000/api/chatbot/message" `
        -Method POST -Body $body -ContentType "application/json"
}
```

---

## 📚 API Reference

### Backend Endpoints

#### 1. POST /api/chatbot/message

**Mô tả**: Gửi tin nhắn và nhận phản hồi từ chatbot

**Request Body**:
```typescript
{
  message: string;        // Bắt buộc, không được rỗng
  languageCode?: string;  // Optional, default: 'vi'
  filterLevel?: number;   // Optional, default: 0.0, range: 0.0-1.0
}
```

**Response Success (200)**:
```typescript
{
  success: true,
  data: {
    userMessage: string;
    botResponse: string;
    languageCode: string;
    metadata: {
      responseId: number;
      resultCode: number;
    }
  }
}
```

**Response Error (400/500)**:
```typescript
{
  success: false,
  message: string;
  error?: string;  // Chỉ trong development mode
}
```

**Ví dụ**:
```javascript
// Success case
fetch('http://localhost:5000/api/chatbot/message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Bạn tên là gì?',
    languageCode: 'vi'
  })
})
.then(res => res.json())
.then(data => console.log(data.data.botResponse));
```

#### 2. GET /api/chatbot/test

**Mô tả**: Kiểm tra kết nối với SimSimi API

**Response (200)**:
```typescript
{
  success: boolean;
  message: string;
  timestamp: string;
}
```

**Ví dụ**:
```javascript
fetch('http://localhost:5000/api/chatbot/test')
  .then(res => res.json())
  .then(data => console.log(data.message));
```

### Frontend Service Methods

#### chatbotService.sendMessage()

```typescript
async sendMessage(
  message: string,
  languageCode: string = 'vi',
  filterLevel: number = 0.0
): Promise<ChatbotResponse>
```

**Ví dụ**:
```typescript
import chatbotService from '@/services/chatbot.service';

const response = await chatbotService.sendMessage('Xin chào', 'vi');
if (response.success) {
  console.log(response.data.botResponse);
}
```

#### chatbotService.testConnection()

```typescript
async testConnection(): Promise<boolean>
```

**Ví dụ**:
```typescript
const isConnected = await chatbotService.testConnection();
console.log('Connected:', isConnected);
```

### Language Codes Supported

| Code | Language | Example |
|------|----------|---------|
| `vi` | Tiếng Việt | "Xin chào" |
| `en` | English | "Hello" |
| `ko` | Korean | "안녕하세요" |
| `ja` | Japanese | "こんにちは" |
| `zh` | Chinese | "你好" |
| `th` | Thai | "สวัสดี" |
| `es` | Spanish | "Hola" |
| `fr` | French | "Bonjour" |
| `de` | German | "Hallo" |
| ... | ... | 40+ others |

**Xem đầy đủ**: http://developer.simsimi.com

---

## 🔧 Troubleshooting

### Lỗi 1: "SimSimi API key is not configured"

**Nguyên nhân**: Chưa có API key trong `.env`

**Giải pháp**:
```bash
# 1. Lấy API key tại http://developer.simsimi.com
# 2. Thêm vào file .env:
SIMSIMI_API_KEY=your_actual_api_key_here

# 3. Restart backend
npm run dev
```

### Lỗi 2: "Failed to connect to SimSimi API"

**Nguyên nhân**: 
- Không có kết nối internet
- API key không hợp lệ
- Đã hết quota (Trial: 1000 requests/day)

**Giải pháp**:
```bash
# Kiểm tra kết nối
curl http://sandbox.api.simsimi.com/request.p?key=YOUR_KEY&lc=en&text=hi

# Kiểm tra quota tại developer.simsimi.com
```

### Lỗi 3: CORS Error

**Nguyên nhân**: Backend chưa config CORS cho frontend

**Giải pháp**: Đảm bảo backend có:
```typescript
// server.ts
import cors from 'cors';
app.use(cors({
  origin: 'http://localhost:5173'
}));
```

### Lỗi 4: "Cannot find module '@/services/chatbot.service'"

**Nguyên nhân**: TypeScript path alias chưa được config

**Giải pháp**: Kiểm tra `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Lỗi 5: Component không hiển thị

**Checklist**:
- ✅ Đã import Chatbot trong App.tsx?
- ✅ Đã thêm `<Chatbot />` trong JSX?
- ✅ Tailwind CSS đã được config?
- ✅ Check browser console có lỗi?

**Debug**:
```typescript
// Thêm console.log để debug
console.log('Chatbot component mounted');
```

### Lỗi 6: Axios not installed

**Giải pháp**:
```bash
cd d:\code\Project\Project\BackEnd
npm install axios
```

---

## 📊 Monitoring & Logs

### Backend Logs

File: `src/services/chatbot.service.ts` và `src/controllers/chatbot.controller.ts` đã có logging:

```typescript
console.error('Chatbot error:', error);
console.error('SimSimi connection test failed:', error);
```

### Frontend Logs

File: `src/services/chatbot.service.ts`:
```typescript
console.error('Chatbot connection test failed:', error);
```

Component: `src/components/Chatbot.tsx`:
```typescript
console.error('Chat error:', error);
```

### Xem Logs

**Backend**:
```bash
# Terminal đang chạy backend sẽ hiển thị logs
npm run dev
```

**Frontend**:
```bash
# Mở Chrome DevTools (F12)
# Tab: Console
```

---

## 🎓 Best Practices

### 1. Security
- ✅ **KHÔNG** commit API key vào Git
- ✅ Sử dụng `.env` file
- ✅ Add `.env` vào `.gitignore`

### 2. Error Handling
- ✅ Luôn có try-catch
- ✅ Hiển thị message thân thiện với user
- ✅ Log chi tiết error cho developer

### 3. User Experience
- ✅ Loading animation khi chờ response
- ✅ Auto scroll xuống tin nhắn mới
- ✅ Disable input khi đang loading
- ✅ Clear input sau khi gửi

### 4. Performance
- ✅ Timeout cho API requests (10s)
- ✅ Không spam requests liên tiếp
- ✅ Optimize re-renders với React

---

## 📈 Next Steps

### Nâng Cao Features

1. **Lưu lịch sử chat vào Database**
   ```typescript
   // Tạo ChatHistory model trong MongoDB
   // Lưu mỗi conversation
   ```

2. **User Authentication**
   ```typescript
   // Chỉ cho phép user đã login chat
   // Gắn chat history với user
   ```

3. **Custom Training Data**
   ```typescript
   // Nếu nâng cấp lên Paid Plan
   // Có thể train custom responses
   ```

4. **Multi-language Toggle**
   ```typescript
   // Thêm dropdown chọn ngôn ngữ trong UI
   // User có thể switch giữa các ngôn ngữ
   ```

5. **Voice Input**
   ```typescript
   // Tích hợp Web Speech API
   // User có thể nói thay vì gõ
   ```

---

## 📞 Support

### SimSimi Documentation
- **Website**: http://developer.simsimi.com
- **API Docs**: http://developer.simsimi.com/docs

### Liên Hệ Developer
- **Email**: [your-email@example.com]
- **GitHub**: [your-github]

---

## ✅ Checklist Hoàn Thành

**Setup**:
- [ ] Lấy API key từ developer.simsimi.com
- [ ] Cập nhật `.env` file
- [ ] Cài đặt axios (`npm install axios`)
- [ ] Import Chatbot component vào App.tsx

**Testing**:
- [ ] Test Backend API endpoint (`/api/chatbot/test`)
- [ ] Test gửi message qua Postman/PowerShell
- [ ] Test Frontend UI (mở chat, gửi message)
- [ ] Test error handling (tắt backend)
- [ ] Test nhiều ngôn ngữ

**Deployment**:
- [ ] Add `.env` vào `.gitignore`
- [ ] Config production API URL
- [ ] Set up environment variables trên hosting
- [ ] Test trên production environment

---

## 📝 Changelog

**Version 1.0.0** - 2026-01-12
- ✅ Tích hợp SimSimi API
- ✅ Tạo Backend service & controller
- ✅ Tạo Frontend service & component
- ✅ UI chat window với Tailwind CSS
- ✅ Error handling & validation
- ✅ Multi-language support
- ✅ Documentation đầy đủ

---

**Tài liệu này được tạo tự động khi tích hợp SimSimi Chatbot**
Cập nhật lần cuối: 2026-01-12
