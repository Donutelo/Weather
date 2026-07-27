import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // Responde rapidamente à verificação CORS
  }
  next();
});

app.get("/api/nomination", async (req, res) => {
  try {
    const { q } = req.query;
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json`,
      {
        headers: {
          "User-Agent": "Weather/1.0 gustavobm2049@hotmail.com",
        },
      },
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, '0.0.0.0', () => console.log('Proxy rodando em http://localhost:3000'));