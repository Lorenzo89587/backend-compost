const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { readFile } = require('fs/promises');
const OpenAI = require('openai');

const app = express();
const port = process.env.PORT || 10000;

const upload = multer({ dest: 'uploads/' });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());

app.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    const imageData = await readFile(req.file.path);
    const base64Image = imageData.toString('base64');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: '¿Qué ves en esta imagen? ¿Es compostable?' },
            {
              type: 'image_url',
              image_url: { url: `data:image/jpeg;base64,${base64Image}` }
            }
          ]
        }
      ]
    });

    const respuesta = response.choices[0].message.content;
    res.json({ respuesta });
  } catch (error) {
    console.error('Error al analizar imagen:', error);
    res.status(500).json({ error: 'No se pudo procesar la imagen.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
