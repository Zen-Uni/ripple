/**
 * @description 注册表单
 * @author Uni
 * @since 1.0
 */

 import { ContainerWrapper, CSSField } from './style'


export default function Register(props) {

    const { setLogStatus } = props
    const handleSwitch = () => {
        setLogStatus(true)
    }

    return (
        <ContainerWrapper>
            <div className="container">
                <div className="title">Ripple</div>
                <div className="form">
                    <CSSField required label="邮箱" variant="standard" error={false}  className="input-style" />
                    <CSSField required label="用户名" variant="standard" error={false}  className="input-style" />
                    <CSSField required type="password" label="密码" variant="standard"  className="input-style" />
                    <div className='captcha'>
                        <CSSField required type="standard" label="验证码" variant="standard"  className="input-style captcha-style" />
                        <div className="captcha-button">获取验证码</div>
                    </div>
                    <div className="submit-button">注册</div>
                </div>
                <div onClick={handleSwitch} className="switch-button">
                    去登录
                </div>
            </div>
        </ContainerWrapper>
    )
}