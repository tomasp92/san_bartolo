const nodemailer = require('nodemailer')
require('dotenv').config()

const { getMonthName, getMonthAndYear } = require('../utils/date_utils')
const {  getAccountDetails } = require('../utils/html_utils')


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

const sendMail = ({ email, additionalMessage, detail, file, totalDebt }) => {
  const debtTitle = totalDebt > 0 ? `Debes $${totalDebt}` : `Tenés a favor $${totalDebt}`;

  return transporter.sendMail({
    from: gmail_user,
    to: email,
    subject: `${debtTitle}. Rendición San Bartolo ${monthName} ${year}`,
    html: `<p>${additionalMessage}</p>
           <p>A continuación se detalla la deuda:</p>
           ${detail}<br>${getAccountDetails()}`,
    attachments: [
      {
        filename: `Rendición San Bartolo ${monthName} ${year}.xlsx`,
        path: file
      }
    ]
  })
  .then(() => {
    return 1;
  })
  .catch(error => {
    console.error(`Error sending email to ${email}:`, error);
    return 0;
  });
};

module.exports = {
  sendMail
}