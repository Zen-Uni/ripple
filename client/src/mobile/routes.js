/**
 * @description Web Mobile 的基础路由配置
 * @author Uni
 * @since 1.0
 */

import Layout from "./components/Layout"
import { Chat, ChatList } from "./pages/Chat"
import Login from "./pages/Login"

import Relation from "./pages/Relation"
import Setting from "./pages/Setting"
import User from "./pages/User"
import Modify from './pages/Modify'
import { Social, Moment, Ripple } from './pages/Social'


const routes = [
    {
        path: '/login',
        element: <Login/>
    },
    {
        path: '/',
        element: <Layout/>,
        children: [
            {
                index: true,
                element: <ChatList/>
            },
            {
                path: 'relation',
                element: <Relation/>
            },
            {
                path: 'social',
                element: <Social/>
            },
            {
                path: 'setting',
                element: <Setting/>
            }
        ]
    },
    {
        // 聊天窗口
        path: '/chat',
        element: <Chat/>
    },
    {
        path: '/user',
        element: <User/>
    },
    {
        path: '/modify',
        element: <Modify/>
    },
    {
        path: '/moment',
        element: <Moment/>
    },
    {
        path: '/ripple',
        element: <Ripple/>
    }
]


export default routes