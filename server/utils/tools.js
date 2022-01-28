const jsonwebtoken = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

const creatCaptcha = () => {
  return Math.random().toString().slice(-6);
};

const jwt = (email) =>
  jsonwebtoken.sign({ email: email }, "Ripple", { expiresIn: "1h" });

const mailreg = (email) => {
  let reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/;
  return reg.test(email);
};

const psdMd5 = (password) => {
  crypto.createHash("md5").update(password).digest("hex");
};

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

module.exports = { mailreg, jwt, creatCaptcha, psdMd5, transporter };
