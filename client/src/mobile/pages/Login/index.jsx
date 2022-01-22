/**
 * @description 登录注册根组件
 * @author Uni
 * @since 1.0
 */

import { useState } from "react"
import Register from "./Register"
import Login from "./Login"
import { LoginAndRegisterWrapper } from "./style"
import { CSSTransition } from 'react-transition-group'


export default function LoginAndRgiester() {

    const [logStatus, setLogStatus] = useState(true)
    // const [animation, setAnimation] = useState(true)

    return (
        <LoginAndRegisterWrapper>
            <CSSTransition
                in={logStatus}
                timeout={300}
                classNames="login"
                unmountOnExit
            >
                <Login setLogStatus={setLogStatus}/>
            </CSSTransition>
            <CSSTransition
                in={!logStatus}
                timeout={300}
                classNames="register"
                unmountOnExit
            >
                <Register setLogStatus={setLogStatus}/>
            </CSSTransition>
        </LoginAndRegisterWrapper>
    )
}