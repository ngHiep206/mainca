import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Beeknoee Proxy Route
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, model, temperature } = req.body;
      const apiKey = process.env.BEEKNOEE_API_KEY?.trim() || 'sk-bee-ba964a33c31147bd8a20c42252eee05d';
      
      if (!apiKey) {
        console.error('BEEKNOEE_API_KEY is missing');
        return res.status(500).json({ error: 'Beeknoee API key is missing. Please set it in AI Studio Secrets.' });
      }

      const targetModel = model || 'glm-4.5-flash';
      console.log(`Proxying to Beeknoee: model=${targetModel}, messages=${messages.length}`);

      const response = await fetch('https://platform.beeknoee.com/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: targetModel,
          messages: messages.map((m: any) => ({ 
            role: m.role === 'assistant' ? 'assistant' : m.role, // Ensure assistant role
            content: m.content 
          })),
          temperature: temperature ?? 0.7,
          stream: false
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Beeknoee API error: Status ${response.status}`, errorText);
        let errorData;
        try { 
          errorData = JSON.parse(errorText); 
        } catch (e) {
          errorData = { message: errorText };
        }
        return res.status(response.status).json({ 
          error: 'Beeknoee API error', 
          message: errorData.message || errorData.error || errorText,
          status: response.status 
        });
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: 'Server Error', details: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve static files from dist
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on http://0.0.0.0:${PORT}`);
  });
}

startServer();
