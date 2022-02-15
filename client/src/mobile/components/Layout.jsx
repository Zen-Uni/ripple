/**
 * @description Web Mobile 的基础布局组件
 * @author Uni
 * @since 1.0
 */

import { Outlet } from "react-router";
import { Wrapper } from ".";
import EventEmmier from "../../utils/event-emitter";
import NavBar from "./NavBar";
import Tittle from './Tittle'

window.event_emitter = new EventEmmier()

export default function Layout() {
    // TODO: 发布订阅实现数据传递✅
    
    return (
        <>
            <Wrapper>
                <Tittle/>
                <Outlet/>
            </Wrapper>
            <NavBar/>
        </>
    )
}