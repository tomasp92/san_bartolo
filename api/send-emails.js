const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { sendEmails } = require('../services');
require('dotenv').config();

const app = express();
const upload = multer({ dest: '/tmp/uploads/' });

// Configurar CORS
app.use(cors({
  origin: ['http://localhost:3000', 'https://san-bartolo-rendiciones.vercel.app'], // Agrega aquí los dominios permitidos
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


module.exports = (req, res) => {
  upload.single('excelFile')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error al subir el archivo' })
    }
    
    const additionalMessage = req.body.additionalMessage || ''
    const pass = req.body.pass || ''
    
    if (pass !== process.env.PASSWORD) {
      return res.status(401).json({
        message: 'Contraseña incorrecta'
      })
    }
    
    try {
      const { sentCount, emails } = await sendEmails({ file: req.file.path, additionalMessage })
      return res.status(200).json({
        message: `${sentCount} correos enviados exitosamente. Los siguientes emails recibieron la rendición: ${emails}`
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Error al enviar correos' })
    }
  })
}