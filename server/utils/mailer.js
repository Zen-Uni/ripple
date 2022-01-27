/**
 * @description Nodemailer
 * @author Airbo
 * @since 1.0
 */
const nodemailer = require("nodemailer");
require('dotenv').config()
module.exports = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  secure: false, 
  auth: {
    user: process.env.MAIL_USERNAME, 
    pass: process.env.MAIL_PASSWORD, 
  },
});
;
