import { GoogleGenAI } from "@google/genai";

export async function askPlayWiseAI(prompt: string, context?: any) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const systemPrompt = `
    You are PlayWise AI, a virtual assistant expert in child developmental psychology and educational toys.
    Your goal is to provide scientific, high-quality advice to parents.
    
    Context about child: ${JSON.stringify(context || "Unknown")}
    
    Guidelines:
    1. Focus on milestones: gross motor, fine motor, language, logic, and emotional skills.
    2. Suggest types of play and toy categories appropriate for the specific age.
    3. Be encouraging, science-based, and compassionate.
    4. Speak in Vietnamese (Tiếng Việt).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { role: 'user', parts: [{ text: systemPrompt + "\n\nUser Question: " + prompt }] }
      ]
    });

    const text = response.text;
    if (!text) {
      throw new Error('Hệ thống AI trả về dữ liệu trống');
    }
    return text;
  } catch (error: any) {
    console.error("AI Service Error:", error);
    return `Xin lỗi, đã xảy ra lỗi: ${error.message || 'Không thể kết nối với hệ thống AI'}. 

Ba mẹ hãy đảm bảo đã thiết lập GEMINI_API_KEY chính xác.`;
  }
}

export async function chatWithGemini(messages: { role: 'user' | 'assistant', content: string }[]) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  // Convert roles for Gemini
  // Gemini uses 'user' and 'model' (assistant)
  const history = messages.slice(0, -1).map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  const lastMessage = messages[messages.length - 1].content;

  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "You are PlayWise AI, a helpful virtual assistant expert in child child development. Speak in Vietnamese."
      },
      history: history as any
    });

    const result = await chat.sendMessage({ message: lastMessage });
    return result.text;
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
}
