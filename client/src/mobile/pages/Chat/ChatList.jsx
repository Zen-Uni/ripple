/**
 * @description 聊天列表根组件
 * @author Uni
 * @since 1.0
 */

import { Link } from 'react-router-dom'

export default function ChatList() {
    return (
        <>
            <div>this is ChatList page</div>
            <Link to="/chat">进入聊天窗口</Link>
        </>        
    )
}