/**
 * @description 鉴权钩子，在绘制组件之前先同步判断是否登录
 * @author Uni
 * @since 1.0
 */

import { useRequest } from "ahooks";
import { Spin } from "antd";
import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { auth } from "../../utils/auth";
import { configReq, removeToken } from "../../utils/token";
import { fetchAuth } from "../service/users";
import store from "../store";
import { authVerifyAction } from "../store/action";


export const AuthContext = createContext(false)

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(false)

    const signin = (callback) => {
        return auth.signin(() => {
            setUser(true)
            callback()
        })
    }

    const signout = (callback) => {
        return auth.signout(() => {
            setUser(false)
            callback()
        })
    }
    const value = { signin, signout, user }
    return (
        <AuthContext.Provider value={value}>{ children }</AuthContext.Provider>
    )
}

// require auth component wrapper
export const AuthRequireWrapper = ({ children }) => {
    const navigate = useNavigate()
    const auth = useContext(AuthContext)
    const { run, loading } = useRequest(fetchAuth, {
        manual: true,
        loadingDelay: 300,
        onSuccess({data}) {
            auth.signin(() => {
                console.log('dispatch users')
                const { _id: id, username, email, avatar_url, headline } = data
                const action = authVerifyAction({
                    id,
                    username,
                    email,
                    avatar_url,
                    headline
                })
                store.dispatch(action)
            })
        },
        onError() {
            auth.signout(() => {
                console.log('remove users')
                removeToken()
                navigate('/login')
            })
        }
    })
    useEffect(() => {
        configReq()
        run()
    }, [])

    if (loading) {
        return <Spin/>
    }

    return children
}