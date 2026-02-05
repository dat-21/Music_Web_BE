# 🤖 AI Chatbot Backend - Multi-Provider Support

Backend hỗ trợ nhiều AI providers:
- ✅ **Gemini AI (Google)** - KHUYÊN DÙNG (Miễn phí, mạnh)
- ✅ **OpenAI GPT** - Tốt nhưng cần trả phí
- ✅ **Rule-based** - Không cần API key, offline

## 🚀 Setup

### 1. Cài đặt dependencies
```bash
cd d:\code\Project\Project\BackEnd
npm install @google/generative-ai openai
```

### 2. Lấy API Keys

#### Option 1: Gemini AI (KHUYÊN DÙNG - MIỄN PHÍ)
1. Truy cập: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy key

#### Option 2: OpenAI GPT
1. Truy cập: https://platform.openai.com/api-keys
2. Tạo API key
3. Copy key (cần thẻ tín dụng)

### 3. Cấu hình .env

Thêm vào `d:\code\Project\Project\BackEnd\.env`:

```env
# AI Chatbot Configuration
AI_PROVIDER=gemini   # Options: gemini, openai, rule-based

# Gemini AI (Google) - FREE
GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI (Paid)
OPENAI_API_KEY=your_openai_api_key_here
```

## 🎯 Usage

Backend tự động sử dụng provider được chọn trong `AI_PROVIDER`.

### Endpoints vẫn giữ nguyên:
- `POST /api/chatbot/message` - Gửi tin nhắn
- `GET /api/chatbot/test` - Test connection

Frontend không cần thay đổi gì!

## 📚 Providers Comparison

| Provider | Cost | Quality | Speed | Languages |
|----------|------|---------|-------|-----------|
| **Gemini** | Free | ⭐⭐⭐⭐⭐ | Fast | 100+ |
| **OpenAI** | $$ | ⭐⭐⭐⭐⭐ | Fast | 50+ |
| **Rule-based** | Free | ⭐⭐ | Instant | Custom |

## 🔄 Switch Provider

Chỉ cần đổi trong `.env`:
```env
AI_PROVIDER=gemini    # Dùng Google Gemini
AI_PROVIDER=openai    # Dùng OpenAI
AI_PROVIDER=rule-based  # Dùng rule-based
```

Restart backend là xong!
