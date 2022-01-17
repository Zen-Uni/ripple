/**
 * @description  Web Mobile 的导航栏组件
 * @author Uni
 * @since 1.0
 */

import { Link } from 'react-router-dom'

export default function NavBar() {
    return (
        <div>
            <ul style={{
                position: "fixed",
                bottom: '0px'
            }}>
                <li>
                    <Link to="/">聊天</Link>
                </li>
                <li>
                    <Link to="/relation">人际</Link>
                </li>
                <li>
                    <Link to="/social">社交</Link>
                </li>
                <li>
                    <Link to="/setting">设置</Link>
                </li>
            </ul>
        </div>
    )
}