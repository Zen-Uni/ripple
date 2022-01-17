/**
 * @description 用户页面根组件
 * @author Uni
 * @since 1.0
 */

import { Link } from 'react-router-dom'
import { Button } from '@mui/material'

export default function User() {
    return (
        <>
            <div>this is User Page</div>
            <Button>
                <Link to="/moment">
                    动态
                </Link>
            </Button>
        </>
    )
}