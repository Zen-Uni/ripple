/**
 * @description 基础页面布局组件
 * @author Uni
 * @since 1.0
 */

import { Outlet } from 'react-router-dom'

export default function Layout(props) {
    console.log(props.children)
    return (
        <>
            <div>this is Layout page</div>
            <Outlet/>
            <div>123</div>
        </>
    )
}