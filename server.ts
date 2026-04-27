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
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Invalid messages format' });
      }

      const envApiKey = process.env.BEEKNOEE_API_KEY?.trim();
      const apiKey = envApiKey || 'sk-bee-ba964a33c31147bd8a20c42252eee05d';
      
      if (!envApiKey) {
        console.warn('[Proxy] BEEKNOEE_API_KEY environment variable is NOT set, using default key.');
      } else {
        console.log('[Proxy] Using API key from environment variables.');
      }

      const targetModel = model || 'glm-4.5-flash';
      
      const payloadMessages = messages.map((m: any) => ({ 
        role: m.role === 'assistant' ? 'assistant' : (m.role === 'system' ? 'system' : 'user'), 
        content: String(m.content || '') 
      }));

      console.log(`[Proxy] Request: model=${targetModel}, messages=${payloadMessages.length}`);
      // console.log('[Proxy] First message role:', payloadMessages[0]?.role);

      const response = await fetch('https://platform.beeknoee.com/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: targetModel,
          messages: payloadMessages,
          temperature: temperature ?? 0.7,
          stream: false
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Proxy] External API Error: Status ${response.status}`, errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText };
        }
        
        return res.status(response.status).json({
          error: 'External API Error',
          message: errorData.message || errorData.error || errorText,
          status: response.status
        });
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error('[Proxy] Server Internal Error:', error);
      res.status(500).json({ 
        error: 'Server Error', 
        message: error.message,
        details: error.stack 
      });
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
