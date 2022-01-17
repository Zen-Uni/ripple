/**
 * @description Web Mobile 通讯录根组件
 * @author Uni
 * @since 1.0
 */

import { Link } from 'react-router-dom'

export default function Relation() {
    return (
        <>
            <div>this is Relationship Page</div>
            <Link to="/chat">进入聊天窗口</Link>
        </>
    )
}