/*const express = require("express");
const cors = require("cors");
const axios = require("axios");*/

import express from 'express';
import cors from 'cors';
import axios from 'axios';

export const app = express();
app.use(cors());

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
    res.status.json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Proxy rodando em http://localhost:3000'));
