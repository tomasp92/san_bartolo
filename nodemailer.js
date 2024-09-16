const nodemailer = require('nodemailer')
require('dotenv').config()

const { getMonthName, getMonthAndYear } = require('./date_utils')
const {  getAccountDetails } = require('./html_utils')


const gmail_user = process.env.GMAIL_USER

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmail_user,
    pass: process.env.GMAIL_PASS 
  }
})

const {month, year} = getMonthAndYear()
const monthName = getMonthName(month)

const sendMail = async ({email, additionalMessage, detail, file, totalDebt}) => {
  const debtTitle = totalDebt > 0 ? `Debes $${totalDebt}` : `Tenés a favor $${totalDebt}`
  console.log('🚀 ~ email:', email, '\n', debtTitle)
   try {
      await transporter.sendMail({
        from: gmail_user,
        to: email,
        subject: `${debtTitle}. Rendición San Bartolo ${monthName} ${year}`,
        html: `<p>${additionalMessage}</p>
            <p>A continuación se detalla la deuda:</p>
            ${detail}<br>${getAccountDetails()}`,
        attachments: [
          {
            filename: `Rendición_San_Bartolo_${monthName}_${year}.xlsx`,
            path: file
          }
        ]
      })
      return 1
    } catch (error) {
      console.error(`Error sending email to ${email}:`, error)
    }
}

module.exports = {
  sendMail
}