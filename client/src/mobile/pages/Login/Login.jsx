/**
 * @description 登录表单组件
 * @author Uni
 * @since 1.0
 */

import { Button, TextField } from '@mui/material'
import { ContainerWrapper, CSSField } from './style'

export default function Login(props) {

    const { setLogStatus } = props


    const handleSwitch = () => {
        setLogStatus(false)
    }

    return (
        <ContainerWrapper>
            <div className="container">
                <div className="title">Ripple</div>
                <div className="form">
                    <CSSField required label="Email" variant="standard" error={false}  className="input-style" />
                    <CSSField required type="password" label="Password" variant="standard"  className="input-style" />
                    <div className="submit-button">登录</div>
                </div>
                <div onClick={handleSwitch} className="switch-button">
                    去注册    
                </div>
            </div>
        </ContainerWrapper>
    )
}