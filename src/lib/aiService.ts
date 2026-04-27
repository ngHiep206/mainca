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
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        model: 'glm-4.5-flash' 
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const detailedMessage = errorData.message || errorData.details || `Error status ${response.status}`;
      throw new Error(detailedMessage);
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Hệ thống AI trả về dữ liệu không hợp lệ');
    }
    return data.choices[0].message.content;
  } catch (error: any) {
    console.error("AI Service Error:", error);
    return `Xin lỗi, đã xảy ra lỗi: ${error.message || 'Không thể kết nối với hệ thống AI'}. 

Ba mẹ hãy kiểm tra lại BEEKNOEE_API_KEY trong phần Secrets của AI Studio.`;
  }
}

export async function chatWithBeeknoee(messages: { role: 'user' | 'assistant', content: string }[], model: string = 'glm-4.5-flash') {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        model
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const detailedMessage = errorData.message || errorData.details || `Error status ${response.status}`;
      throw new Error(detailedMessage);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error: any) {
    console.error("Beeknoee Chat Error:", error);
    throw error;
  }
}
