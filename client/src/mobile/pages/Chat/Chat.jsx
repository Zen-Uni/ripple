/**
 * @description 聊天窗口页面
 * @author Uni
 * @since 1.0
 */

import { Link } from 'react-router-dom'
import { Button } from '@mui/material'

export default function Chat() {
    return (
        <>
            <div>这是聊天窗口</div>
            <Button variant="contained">
                <Link to="/user">去个人页面</Link>
            </Button>
        </>
    )
}