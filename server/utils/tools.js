const CRYPTO = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { EMAIL_OPTIONS, SENDER_OPTIONS, TOKEN_CONFIG } = require("../config");

/**
 * 判断变量是否未定义
 * @param { object } v
 * @returns { boolean }
 */
const isUndef = (v) => v === undefined || v === null;

/**
 * 判断变量是否已定义
 * @param { object } v
 * @returns { boolean }
 */
const isDef = (v) => v !== undefined && v !== null;

/**
 * md5加密函数
 * @param { string } v 加密字段
 */
const md5Crypto = (v) => {
  const md5 = CRYPTO.createHash("md5");
  const vLength = v.length;
  // 每次分段加密的字符串最大长度
  while (v) {
    const tempV = v.slice(0, 5);
    v = v.slice(5);
    md5.update(`${tempV} - `);
  }
  return md5.digest("hex");
};

/**
 * 检查参数完整性
 * @param { Object } obj
 * @param { Array<string> } params
 */
const checkIntegrity = (obj, params) => {
  return params
    ? params.every((v) => {
        return isDef(obj[v]);
      })
    : toArray(obj).every((v) => {
        return isDef(v);
      });
};

/**
 * 发送邮件
 * @param {string} email
 * @param {string} captcha
 */
const sendMail = async (email, captcha) => {
  const transporter = nodemailer.createTransport(EMAIL_OPTIONS);
  const MAIL_CONTENT = {
    ...SENDER_OPTIONS,
    to: email,
    subject: "ripple注册邮件",
    html: `你正在注册ripple，验证码为${captcha}`,
  };
  await transporter.sendMail(MAIL_CONTENT);
};

/**
 * 注册token
 * @param {string} email
 * @returns {string} token
 */
const signToken = (email) => {
  const token = jwt.sign(
    { iss: "ripple", iat: Date.now(), uEmail: email },
    TOKEN_CONFIG.tokenSecret,
    { expiresIn: TOKEN_CONFIG.tokenExpiredTime }
  );
  return token;
};


class Restful {
  constructor(code, msg, data) {
    this.code = code;
    this.msg = msg;
    this.data = data;
  }
}

module.exports = {
  md5Crypto,
  isUndef,
  checkIntegrity,
  sendMail,
  signToken,
  Restful,
};
