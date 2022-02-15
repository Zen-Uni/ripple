/**
 * @description 注册表单
 * @author Uni
 * @since 1.0
 */

import { useRequest } from 'ahooks'
import { useState } from 'react'
import { fetchCaptcha, fetchRegister } from '../../service/users'
import { ContainerWrapper, CSSField } from './style'
import { message } from 'antd'
import { configReq, storeToken } from '../../../utils/token'
import { useNavigate } from 'react-router'
import { useAuth } from '../../hooks/useAuth'


export default function Register(props) {
    const navigate = useNavigate()

    const [user, setUser] = useState({
        email: '',
        password: '',
        username: '',
        captcha: ''
    })

    const auth = useAuth()

    const { setLogStatus } = props
    const handleSwitch = () => {
        setLogStatus(true)
    }

    // 获取验证码
    const { run: runCaptcha } = useRequest(fetchCaptcha, {
        manual: true,
        onSuccess(res) {
            message.success(res.data.msg)
            console.log(res)
        },
        onError(res) {
            message.error('获取验证码失败')
        }
    })

    const { run: runRgister } = useRequest(fetchRegister, {
        manual: true,
        onSuccess({data}) {
            message.success(data?.msg, 1, () => {
                navigate('/')
            })
            storeToken(data?.data?.token)
            configReq()
            auth.signin()
        },
        onError({response}) {
            if (response.status === 422) {
                message.error('存在字段缺失')
            } else {
                message.error(response.data.msg)
            }
        }
    })

    const getCaptch = () => {
        runCaptcha(null, `?email=${user.email}`)
    }

    const handleRegister = () => {
        runRgister(user)
    }

    return (
        <ContainerWrapper>
            <div className="container">
                <div className="title">Ripple</div>
                <div className="form">
                    <CSSField required label="邮箱" variant="standard" error={false}  className="input-style" 
                        value={user.email} 
                        onChange={(e) => setUser({
                            ...user,
                            email: e.target.value
                        })}/>
                    <CSSField required label="用户名" variant="standard" error={false}  className="input-style" 
                        value={user.username} 
                        onChange={(e) => setUser({
                            ...user,
                            username: e.target.value
                        })}
                    />
                    <CSSField required type="password" label="密码" variant="standard"  className="input-style" 
                        value={user.password} 
                        onChange={(e) => setUser({
                            ...user,
                            password: e.target.value
                        })}
                    />
                    <div className='captcha'>
                        <CSSField required type="standard" label="验证码" variant="standard"  className="input-style captcha-style" 
                            value={user.captcha} 
                            onChange={(e) => setUser({
                                ...user,
                                captcha: e.target.value
                            })}
                        />
                        <div className="captcha-button" onClick={getCaptch}>获取验证码</div>
                    </div>
                    <div className="submit-button" onClick={handleRegister}>注册</div>
                </div>
                <div onClick={handleSwitch} className="switch-button">
                    去登录
                </div>
            </div>
        </ContainerWrapper>
    )
}

