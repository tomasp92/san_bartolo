const Redis = require('ioredis')

const redis = new Redis(process.env.REDIS)

redis.on('connect', () => {
  console.log('Conectado a Redis Cloud')
})

redis.on('error', (err) => {
  console.error('Error de conexión a Redis:', err)
})

module.exports = redis
