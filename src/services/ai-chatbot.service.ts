import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

interface ChatResponse {
  response: string;
  provider: string;
  model?: string;
  error?: boolean;
}

/**
 * AI Chatbot Service - Multi-Provider Support
 * Hỗ trợ: Gemini AI, OpenAI, Rule-based
 */
class AIChatbotService {
  private provider: string;
  private geminiAI?: GoogleGenerativeAI;
  private geminiModel?: GenerativeModel;

  constructor() {
    this.provider = process.env.AI_PROVIDER || 'gemini';
    this.initializeProviders();
  }

  /**
   * Khởi tạo AI providers
   */
  private initializeProviders() {
    // Initialize Gemini AI
    if (this.provider === 'gemini' && process.env.GEMINI_API_KEY) {
      try {
        this.geminiAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.geminiModel = this.geminiAI.getGenerativeModel({ model: 'gemini-pro' });
        console.log('✅ Gemini AI initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize Gemini AI:', error);
      }
    }

    console.log(`🤖 Using AI Provider: ${this.provider}`);
  }

  /**
   * Chat với AI - tự động chọn provider
   */
  async chat(
    message: string,
    languageCode: string = 'vi',
    context?: string
  ): Promise<ChatResponse> {
    try {
      switch (this.provider) {
        case 'gemini':
          return await this.chatWithGemini(message, languageCode, context);
        
        case 'openai':
          return await this.chatWithOpenAI(message, languageCode, context);
        
        case 'rule-based':
        default:
          return await this.chatWithRuleBased(message, languageCode);
      }
    } catch (error: unknown) {
      console.error('Chat error:', error);
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to get AI response: ${message}`);
    }
  }

  /**
   * Chat với Google Gemini AI
   */
  private async chatWithGemini(
    message: string,
    languageCode: string,
    context?: string
  ): Promise<ChatResponse> {
    if (!this.geminiModel) {
      throw new Error('Gemini AI not initialized. Please check GEMINI_API_KEY in .env');
    }

    try {
      // Tạo prompt với ngữ cảnh
      const languageMap: Record<string, string> = {
        'vi': 'Tiếng Việt',
        'en': 'English',
        'ko': 'Korean',
        'ja': 'Japanese',
        'zh': 'Chinese',
        'th': 'Thai',
        'es': 'Spanish',
        'fr': 'French'
      };

      const language = languageMap[languageCode] || 'Vietnamese';
      
      const systemPrompt = `You are a friendly and helpful AI assistant. 
Respond in ${language} language.
Keep your responses conversational, natural, and concise (2-3 sentences max).
Be warm, friendly, and engaging.
${context ? `Context: ${context}` : ''}`;

      const fullPrompt = `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`;

      const result = await this.geminiModel.generateContent(fullPrompt);
      const response = result.response;
      const text = response.text();

      return {
        response: text.trim(),
        provider: 'gemini',
        model: 'gemini-pro'
      };
    } catch (error: unknown) {
      console.error('Gemini error:', error);
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Gemini AI error: ${message}`);
    }
  }

  /**
   * Chat với OpenAI GPT (placeholder - cần implement)
   */
  private async chatWithOpenAI(
    message: string,
    languageCode: string,
    context?: string
  ): Promise<ChatResponse> {
    // TODO: Implement OpenAI integration
    throw new Error('OpenAI integration not implemented yet. Please use Gemini or rule-based.');
  }

  /**
   * Rule-based chatbot (không cần API key)
   */
  private async chatWithRuleBased(
    message: string,
    languageCode: string
  ): Promise<ChatResponse> {
    const lowerMessage = message.toLowerCase().trim();

    // Vietnamese responses
    const viResponses: Record<string, string[]> = {
      'xin chào|chào|hello|hi|hey': [
        'Chào bạn! Mình có thể giúp gì cho bạn?',
        'Xin chào! Rất vui được nói chuyện với bạn!',
        'Hi! Bạn cần mình giúp gì không?'
      ],
      'tên|name': [
        'Mình là trợ lý AI. Bạn có thể gọi mình là Bot nhé!',
        'Mình là chatbot AI được tạo để giúp đỡ bạn!',
        'Tên mình là AI Assistant!'
      ],
      'khỏe|how are you|thế nào': [
        'Mình khỏe! Cảm ơn bạn đã hỏi. Còn bạn thế nào?',
        'Tuyệt vời! Bạn hôm nay thế nào?',
        'Mình vẫn ổn! Bạn có việc gì cần giúp không?'
      ],
      'cảm ơn|thank|thanks': [
        'Không có gì! Rất vui được giúp đỡ bạn!',
        'Luôn sẵn sàng giúp bạn!',
        'Hân hạnh! Bạn cần gì thêm không?'
      ],
      'tạm biệt|bye|goodbye': [
        'Tạm biệt! Hẹn gặp lại bạn!',
        'Bye bye! Chúc bạn một ngày tốt lành!',
        'Hẹn gặp lại nhé!'
      ],
      'giúp|help': [
        'Mình có thể chat với bạn về nhiều chủ đề. Hãy hỏi mình bất cứ điều gì!',
        'Bạn có thể hỏi mình bất kỳ câu hỏi nào, mình sẽ cố gắng trả lời!',
        'Mình sẵn sàng trò chuyện với bạn!'
      ]
    };

    // English responses
    const enResponses: Record<string, string[]> = {
      'hello|hi|hey': [
        'Hello! How can I help you today?',
        'Hi there! Nice to meet you!',
        'Hey! What can I do for you?'
      ],
      'name': [
        "I'm an AI assistant. You can call me Bot!",
        "I'm a chatbot created to help you!",
        'My name is AI Assistant!'
      ],
      'how are you': [
        "I'm doing great! How about you?",
        "I'm well, thank you! How can I help?",
        "I'm fine! What brings you here?"
      ],
      'thank': [
        "You're welcome!",
        'Happy to help!',
        'My pleasure!'
      ],
      'bye|goodbye': [
        'Goodbye! Have a great day!',
        'See you later!',
        'Bye! Come back soon!'
      ]
    };

    const responses = languageCode === 'en' ? enResponses : viResponses;
    
    // Tìm pattern phù hợp
    for (const [patterns, replies] of Object.entries(responses)) {
      const regex = new RegExp(patterns, 'i');
      if (regex.test(lowerMessage)) {
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        return {
          response: randomReply,
          provider: 'rule-based'
        };
      }
    }

    // Default response
    const defaultResponses = languageCode === 'en' 
      ? [
          "I'm not sure I understand. Could you rephrase that?",
          "Interesting! Tell me more.",
          "I'm still learning. Could you ask me something else?"
        ]
      : [
          'Mình chưa hiểu lắm. Bạn có thể diễn đạt lại được không?',
          'Thú vị! Kể mình nghe thêm đi!',
          'Mình đang học hỏi. Bạn thử hỏi mình câu khác nhé!'
        ];

    return {
      response: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
      provider: 'rule-based'
    };
  }

  /**
   * Test connection với AI provider
   */
  async testConnection(): Promise<boolean> {
    try {
      const testMessage = 'Hello';
      const response = await this.chat(testMessage, 'en');
      return !!response.response;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  /**
   * Lấy thông tin provider hiện tại
   */
  getProviderInfo() {
    return {
      provider: this.provider,
      available: {
        gemini: !!process.env.GEMINI_API_KEY,
        openai: !!process.env.OPENAI_API_KEY,
        ruleBased: true
      }
    };
  }
}

export default new AIChatbotService();
