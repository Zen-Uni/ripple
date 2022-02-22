const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const EMAIL_OPTIONS = {
  host: "smtp.qq.com",
  port: 465,
  auth: {
    user: "1612404112@qq.com",
    pass: "vqxvfwqjgideechb",
  },
};

const SENDER_OPTIONS = {
  from: {
    name: "ripple",
    address: "1612404112@qq.com",
  },
};

const TOKEN_CONFIG = {
  tokenSecret: "fwf_ripple",
  tokenExpiredTime: 5 * DAY,
};

module.exports = {
  EMAIL_OPTIONS,
  SENDER_OPTIONS,
  TOKEN_CONFIG
};
