require('dotenv').config()
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
})

transporter.verify((error) => {
    if (error) {
        console.error(error)
        return
    }
    console.log('Ripple-backend已初始化邮件服务...')
})

const sendMail = (to, subject, content) =>
    transporter.sendMail({
        from: `"Ripple" ${process.env.MAIL_USER}`,
        to,
        subject,
        ...content,
    })

module.exports = {
    sendMail,
}
