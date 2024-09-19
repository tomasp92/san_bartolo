const multer = require('multer')
const allowCors = require('../adapters/cors')
const emailQueue = require('../queues/email.queues')
require('dotenv').config()

const upload = multer({ dest: '/tmp/uploads/' })


module.exports = allowCors((req, res) => {
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
      // Encolamos el trabajo en Redis
      await emailQueue.add({
        file: req.file.path,
        additionalMessage
      });

      return res.status(200).json({
        message: `El trabajo de enviar correos ha sido encolado y será procesado en segundo plano.`
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al encolar el trabajo' });
    }
  })
})

