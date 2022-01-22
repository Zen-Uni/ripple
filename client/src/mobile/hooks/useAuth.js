/**
 * @description 鉴权钩子，在绘制组件之前先同步判断是否登录
 * @author Uni
 * @since 1.0
 */

import { createContext, useContext, useState } from "react";
import { Navigate } from "react-router";
import { auth } from "../../utils/auth";

export const AuthContext = createContext(false)

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    const signin = (callback) => {
        return auth.signin(() => {
            setUser("Uni")
            callback()
        })
    }

    const signout = (callback) => {
        return auth.signout(() => {
            setUser(null)
            callback()
        })
    }


    const value = { user, signin, signout }
    return (
        <AuthContext.Provider value={value}>{ children }</AuthContext.Provider>
    )
}

// require auth component wrapper
export const AuthRequireWrapper = ({ children }) => {
    const { user } = useContext(AuthContext)


    if (!user) {
        return <Navigate to='/login' replace/>
    }

    return children
}