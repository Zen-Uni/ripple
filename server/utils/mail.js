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

const sendMail = async (to, subject, content) => {
    new Promise(async (resolve, reject) => {
        const [err] = await transporter
            .sendMail({
                from: `"Ripple" ${process.env.MAIL_USER}`,
                to,
                subject,
                ...content,
            })
            .then((info) => [null, info])
            .catch((err) => [err, null])
        if (err !== null) {
            reject()
            return
        }
        resolve()
    })
}

module.exports = {
    sendMail,
}
