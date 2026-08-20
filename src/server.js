import express from 'express';
import cors from 'cors';
import axios from 'axios';

const PORT = process.env.PORT || 3000;
const app = express();
const allowedOrigins = [
  'https://donutelo.github.io',
  'https://reimagined-orbit-v7vpx5q6gj53pqw5-8080.app.github.dev',
  'https://reimagined-orbit-v7vpx5q6gj53pqw5-3000.app.github.dev',
  'http://localhost:8080',
  'https://localhost:3000',
]

/*
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // Responde rapidamente à verificação CORS
  }
  next();
});
*/

app.use((req, res, next) => {
  console.log('Origin:', req.headers.origin);
  next();
});


app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log('Origem bloqueada:', origin);
    callback(new Error(`Origem não permitida: ${origin}`));
  },
  methods: ['GET', 'OPTIONS'],
}))

app.get("/api/nomination", async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        error: 'O parâmetro q é obrigatório',
      })
    }

    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`, {
        params: {
          q,
          format: 'json',
          dedupe: 1,
          limit: 30,
          extratags: 1,
          addressdetails: 1,
        },
        headers: {
          "User-Agent": "Weather/1.0 (https://donutelo.github.io; contato: gustavobm2049@hotmail.com)'",
        },
        timeout: 15000,
      },
    );
    res.json(response.data);
  } catch (error) {

    console.error('Erro ao consultar o Nomination', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
    } );

    res.status(429).json({
      error: 'O serviço de geocodificação está temporariamente limitando as requisições. Tente novamente em alguns instantes',
    });

    res.status(500).json({
      error: 'Erro ao consultar o serviço de geocodificação',
      detail: error.response?.data || error.message,
    });

    res.status(502).json({
      error: 'O serviço de geocodificação não respondeu corretamente',
    });
  }
});

app.listen(PORT, '0.0.0.0', () => console.log(`Proxy rodando em http://localhost:${PORT}`));