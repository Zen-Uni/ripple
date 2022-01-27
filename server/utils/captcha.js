/**
 * @description 注册验证随机验证码
 * @author Airbo
 * @since 1.0
 */
module.exports =()=>{
    //返回六位随机数字
    return Math.random().toString().slice(-6);
}