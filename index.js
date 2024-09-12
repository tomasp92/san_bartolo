const express = require('express')
const multer = require('multer')
require('dotenv').config()

const { sendEmails } = require('./services')

const app = express()
const upload = multer({ dest: 'uploads/' })

app.post('/send-emails', upload.single('excelFile'), async (req, res) => {
  const additionalMessage = req.body.additionalMessage || ''
  const pass = req.body.pass || ''

  if (pass !== process.env.PASSWORD ) {
    res.status(401).json({
      message: 'Contraseña incorrecta'
    })
  }
  const { sentCount, emails, error } = await sendEmails({ file: req.file.path, additionalMessage})
  if (error) {
    res.status(error.number).json(error.json)
  }
  res.status(200).json({
    message: `${sentCount} correos enviados exitosamente. Los siguientes emails recibieron la rendición: ${emails}`
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`))
