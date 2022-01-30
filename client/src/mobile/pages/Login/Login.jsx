/**
 * @description 登录表单组件
 * @author Uni
 * @since 1.0
 */

import { Button, TextField } from '@mui/material'
import { useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { AuthContext } from '../../hooks/useAuth'
import { ContainerWrapper, CSSField } from './style'

export default function Login(props) {

    const { setLogStatus } = props

    const { signin } = useContext(AuthContext)

    const handleSwitch = () => {
        setLogStatus(false)
    }

    const navigate = useNavigate()

    const handleChange = (e, callback) => {
        callback(e.target.value)
    }

    const handleLogin = () => {
        const payload = {
            email,
            password
        }

        if (!handleCheck(payload)) return false
        signin(() => {
            navigate('/')
        })
    }

    const handleCheck = ({ email, password }) => {
        if (!email.trim() || !password.trim()) return false;
        return true
    }

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    return (
        <ContainerWrapper>
            <div className="container">
                <div className="title">Ripple</div>
                <div className="form">
                    <CSSField required label="邮箱" variant="standard" value={email}  className="input-style" onChange={e => handleChange(e, setEmail)}/>
                    <CSSField required type="password" label="密码" variant="standard" value={password} className="input-style" onChange={e => handleChange(e, setPassword)}/>
                    <div className="submit-button" onClick={handleLogin}>登录</div>
                </div>
                <div onClick={handleSwitch} className="switch-button">
                    去注册    
                </div>
            </div>
        </ContainerWrapper>
    )
}