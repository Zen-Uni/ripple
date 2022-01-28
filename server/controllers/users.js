/**
 * @description 与 users 相关的控制器
 * @author Uni
 * @since 1.0
 */

const {
  mailreg,
  jwt,
  creatCaptcha,
  psdMd5,
  transporter,
} = require("../utils/tools");
const jsonwebtoken = require("jsonwebtoken");
const CODE = require("../utils/const");
const createDebug = require("debug");
const User = require("../models/User");
const Cache = require("../models/Cache");

let registe = (email, password, username) =>
  new Promise((resolve, reject) => {
    new User({
      email: email,
      password: password,
      username: username,
      createDate: new Date(),
    }).save((err) => {
      if (!err) {
        resolve(1);
      } else {
        reject(err);
      }
    });
  });

let checkCaptcha = (email) =>
  new Promise((resolve, reject) => {
    Cache.find({ email: email, createdAt: { $gte: 1 } }, (err, docs) => {
      if (err) reject(err);
      else {
        resolve(docs.pop());
      }
    });
  });

let findAccount = (email) =>
  new Promise((resolve, reject) => {
    User.find({ email: email }, (err, doc) => {
      if (err) reject(err);
      else {
        resolve(doc.pop());
      }
    });
  });

class UsersCtl {
  index(ctx, next) {
    ctx.body = "这是 users 的根路由";
  }

  /**
   * @description auth & login & register & captcha
   * @author Airbo
   * @since 1.0
   */
  //TODO 统一verifyParams校验数据格式不正确后返回的信息

  auth(ctx) {
    let authorization = ctx.request.header.authorization.split(" ")[1];
    const debug = createDebug("user:auth");
    try {
      let decoded  = jsonwebtoken.verify(authorization, "Ripple")
      ctx.status = 200;
      ctx.body = {
        msg: "token 验证成功",
        code: CODE.SUCCESS,
      };
      debug(decoded)
    } catch (e) {
      ctx.status = 401;
      ctx.body = {
        msg: "token 验证失败",
        code: CODE.USERAUTH_FAIL_WRONGTOKEN,
      };
      debug(e)
    }
  }

  async login(ctx) {
    ctx.verifyParams({
      email: {
        type: "string",
        require: true,
      },
      password: {
        type: "string",
        require: true,
      },
    });
    let { email, password } = ctx.request.body;
    let resCont;
    const debug = createDebug("user:login");
    try {
      if (mailreg(email)) {
        let doc = await findAccount(email);
        if (doc && (await psdMd5(password)) == doc.password) {
          resCont = {
            msg: "登录成功",
            data: "Bear " + jwt(email),
            code: CODE.SUCCESS,
          };
        } else {
          resCont = {
            msg: "账号不存在或密码错误",
            code: CODE.USERLOGIN_FAUL_WRONGINFO,
          };
        }
      } else {
        debug(`inputEmail: ${email} is not a email adress`);
        resCont = {
          msg: "错误的邮箱地址",
          code: CODE.PARAMTER_ERROR_NOTEMAIL,
        };
      }
    } catch (err) {
      resCont = {
        msg: "登录失败",
        code: CODE.USERLOGIN_FAUL_CAUGHT,
      };
      debug(`Caught err: ${err}`);
    } finally {
      ctx.status = 200;
      ctx.body = resCont;
      debug(`resCont: ${JSON.stringify(resCont)}`);
    }
  }

  async register(ctx) {
    ctx.verifyParams({
      email: {
        type: "string",
        require: true,
      },
      password: {
        type: "string",
        require: true,
      },
      username: {
        type: "string",
        require: true,
      },
      captcha: {
        type: "string",
        require: true,
      },
    });
    let { email, password, username, captcha } = ctx.request.body;
    let resCont;
    const debug = createDebug("user:register");

    try {
      if (mailreg(email)) {
        let doc = await checkCaptcha(email);
        if (doc == undefined) {
          debug(`this email do not have captcha: ${email}`);
          return (resCont = {
            msg: "无验证码",
            code: CODE.USERCAPTCHA_STOP_NOCAPTCHA,
          });
        }
        if (captcha == doc.captcha) {
          let md5PSD = await psdMd5(password);
          await registe(email, md5PSD, username, captcha)
            .then((res) => {
              if (res == 1) {
                resCont = {
                  msg: "注册成功",
                  data: "Bear " + jwt(email),
                  code: CODE.SUCCESS,
                };
              }
              debug(`registerSuccessful,userInfo: ${(email, username)}`);
            })
            .catch((err) => {
              resCont = {
                msg: "注册失败",
                code: CODE.USERREGISTER_FAIL_CAUGHT,
              };
              debug(`注册失败, ${err}`);
            });
        } else {
          resCont = {
            msg: "验证码错误或过期",
            code: CODE.USERREGISTER_FAIL_CAPTCHAWRONG,
          };
          debug(`registerSuccessful,userInfo: ${(email, username)}`);
        }
      } else {
        resCont = {
          msg: "错误的邮箱地址",
          code: CODE.PARAMTER_ERROR_NOTEMAIL,
        };
        debug(`inputEmail: ${email} is not a email adress`);
      }
    } catch (err) {
      resCont = {
        msg: "注册失败",
        code: CODE.USERREGISTER_FAIL_CAUGHT,
      };
      debug(`Caught err: ${err}`);
    } finally {
      ctx.status = 200;
      ctx.body = resCont;
      debug(`resCont: ${JSON.stringify(resCont)}`);
    }
  }

  async captcha(ctx) {
    ctx.verifyParams({
      email: {
        type: "string",
        require: true,
      },
    });

    let { email } = ctx.request.body;
    let resCont;
    const debug = createDebug("user:captcha");

    try {
      if (mailreg(email)) {
        let doc = await checkCaptcha(email);
        if (doc && new Date() - doc.createdAt < 1000 * 60) {
          resCont = {
            msg: "请勿多次请求验证码",
            code: CODE.USERCAPTCHA_STOP_SNEDTOFAST,
          };
          debug(`adventure: ${JSON.stringify(doc)}`);
        } else {
          let captcha = creatCaptcha();
          new Cache({
            email: email,
            captcha: captcha,
            createdAt: new Date(),
          }).save((err) => {
            if (err) return console.error(err);
          });

          let mailCofig = {
            from: '"AirboZH" <airbozh@qq.com>', // sender address
            to: email, // list of receivers
            subject: "[Ripple] 欢迎注册Ripple", // Subject line
            html: `<p>您好，你正在注册Ripple聊天室，您的验证码是<b>${captcha}</b>（5分钟后过期）</p>`, // html body
          };
          await transporter.sendMail(mailCofig);
          resCont = {
            msg: "验证码发送成功",
            code: CODE.SUCCESS,
          };
          debug(`mailCofig: ${JSON.stringify(mailCofig)}`);
        }
      } else {
        resCont = {
          msg: "错误的邮箱地址",
          code: CODE.PARAMTER_ERROR_NOTEMAIL,
        };
        debug(`inputEmail: ${email} is not a email adress`);
      }
    } catch (err) {
      resCont = {
        msg: "验证码发送失败",
        code: CODE.USERCAPTCHA_SENDFAIL_CAUGHT,
      };
      debug(`Caught err: ${err}`);
    } finally {
      ctx.status = 200;
      ctx.body = resCont;
      debug(`resCont: ${JSON.stringify(resCont)}`);
    }
  }
}

module.exports = new UsersCtl();
