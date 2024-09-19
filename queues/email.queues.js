const Queue = require('bull')
require('dotenv').config()

const redisClient = require('../adapters/redis')

// Crear una cola para enviar emails
const emailQueue = new Queue('emailQueue', process.env.REDIS)

module.exports = emailQueue

// const emailProcess = require('../processes/email.process')

// const emailQueue = new Bull('email',{
//     redis: process.env.REDIS
// })

// emailQueue.process(emailProcess)

// const sendNewEmail = (data) => {
//     console.log('🚀 ~ data:', data)
//     emailQueue.add(data,{

//     })
// }

// module.exports = sendNewEmail
