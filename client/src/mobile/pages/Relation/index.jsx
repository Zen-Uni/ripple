/**
 * @description Web Mobile 通讯录根组件
 * @author Uni
 * @since 1.0
 */

import { Link } from 'react-router-dom'
import UserItem from '../../components/Relation/UserItem.jsx'

export default function Relation() {
    return (
        <>
            <UserItem avatar="https://mui.com/static/images/avatar/1.jpg" name="jojo"></UserItem>
            <UserItem avatar="https://mui.com/static/images/avatar/1.jpg" name="jojo"></UserItem>
        </>
    )
}