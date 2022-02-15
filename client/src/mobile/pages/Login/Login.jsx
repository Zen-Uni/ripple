/**
 * @description 登录表单组件
 * @author Uni
 * @since 1.0
 */

import { Button, TextField } from '@mui/material'
import { useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { AuthContext, useAuth } from '../../hooks/useAuth'
import { ContainerWrapper, CSSField } from './style'

import { useRequest } from 'ahooks'
import { fetchCaptcha, fetchLogin } from '../../service/users'
import { message } from 'antd'
import { configReq, storeToken } from '../../../utils/token'

export default function Login(props) {
    const [user, setUser] = useState({
        email: '',
        password: ''
    })
    const auth = useAuth()
    const { setLogStatus } = props

    const handleSwitch = () => {
        setLogStatus(false)
    }

    const navigate = useNavigate()

    const { run: runLogin } = useRequest(fetchLogin, {
        manual: true,
        onSuccess({data}) {
            message.success(data?.msg, 1, () => {
                console.log(1)
                navigate('/')
            })
            console.log(data?.data)
            storeToken(data?.data?.token)
            configReq()
            auth.signin()
        },
        onError({response}) {
            message.error(response.data.msg)
        }
    })

    const handleCheck = ({ email, password }) => {
        if (!email.trim() || !password.trim()) {
            message.error('用户邮箱或密码不能为空')
            return false
        }
        return true
    }

    const handleLogin = () => {
       handleCheck(user) && runLogin(user)
    }

  



    return (
        <ContainerWrapper>
            <div className="container">
                <div className="title">Ripple</div>
                <div className="form">
                    <CSSField required label="邮箱" variant="standard" value={user.email}  className="input-style" 
                        onChange={e => {
                            setUser({
                                ...user,
                                email: e.target.value
                            })
                        }}
                    />
                    <CSSField required type="password" label="密码" variant="standard" value={user.password} className="input-style" 
                         onChange={e => {
                            setUser({
                                ...user,
                                password: e.target.value
                            })
                        }}
                    />
                    <div className="submit-button" onClick={handleLogin}>登录</div>
                </div>
                <div onClick={handleSwitch} className="switch-button">
                    去注册    
                </div>
            </div>
        </ContainerWrapper>
    )
}