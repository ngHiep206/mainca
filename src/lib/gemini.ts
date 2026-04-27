import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function askPlayWiseAI(prompt: string, context?: any) {
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
      contents: prompt,
      config: {
        systemInstruction: systemPrompt
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Xin lỗi, tôi gặp sự cố khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.";
  }
}
