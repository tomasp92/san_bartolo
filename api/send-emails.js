const multer = require('multer')
require('dotenv').config()
const fs = require('fs')
const util = require('util')
const readFile = util.promisify(fs.readFile)
const allowCors = require('../adapters/cors')
const redisClient = require('../adapters/redis')

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
        message: 'Contraseña incorrecta',
      })
    }

    try {
      const fileContent = await readFile(req.file.path)
      const fileKey = `file_key_${Date.now()}`

      const job = {
        'fileKey': fileKey,
        file: fileContent,
        fileName: req.file.originalname,
        additionalMessage,
      }

      await redisClient.set(fileKey, fileContent)
      console.log('File stored successfully in Redis')

      await redisClient.rpush('emailQueue', JSON.stringify(job))

      return res.status(200).json({
        message: `El trabajo de enviar correos ha comenzado. Recibirás un resumen de lo enviado al mail sanbartolo.pagos@gmail.com una vez finalizado el trabajo`,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Error al encolar el trabajo' })
    }
  })
})

