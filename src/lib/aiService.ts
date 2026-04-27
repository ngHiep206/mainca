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
        model: 'glm-4.5-flash' // Default Beeknowe model
      })
    });

    if (!response.ok) throw new Error('AI Service failed');

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("AI Service Error:", error);
    return "Xin lỗi, tôi gặp sự cố khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.";
  }
}
