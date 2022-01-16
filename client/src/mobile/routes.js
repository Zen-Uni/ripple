/**
 * @description Web Mobile 的基础路由配置
 * @author Uni
 * @since 1.0
 */

import { Test1, Test2, Test3 } from "./components";
import Layout from "./pages/Layout";
import Login from "./pages/Login";


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
                path: 'test1',
                element: <Test1/>,
                children: [
                    {
                        path: 'test3',
                        element: <Test3/>
                    }
                ]
            },
            {
                path: 'test2',
                element: <Test2/>
            }
        ]
    }
]


export default routes