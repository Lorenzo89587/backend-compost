require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

app.post('/analizar-imagen', async (req, res) => {
  try {
    const { base64Image } = req.body;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: '¿Qué ves en esta imagen? ¿Es compostable?' },
            {
              type: 'image_url',
              image_url: { url: base64Image }
            }
          ]
        }
      ]
    });

    const respuesta = response.choices[0].message.content;
    res.json({ respuesta });
  } catch (error) {
    console.error('Error al enviar a ChatGPT:', error);
    res.status(500).json({ error: 'No se pudo procesar la imagen.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});