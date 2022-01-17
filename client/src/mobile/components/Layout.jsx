/**
 * @description Web Mobile 的基础布局组件
 * @author Uni
 * @since 1.0
 */

import { Outlet } from "react-router";
import NavBar from "./NavBar";

export default function Layout() {
    return (
        <>
            <div>this is Layout component</div>
            <NavBar/>
            <Outlet/>
        </>
    )
}