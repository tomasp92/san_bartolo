const express = require('express')
const app = express()
const hello = require('./api/index')
const sendEmails = require('./api/send-emails')

app.use('/api/hello', hello)
app.use('/api/send-emails', sendEmails)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

