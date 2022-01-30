/**
 * @description  Web Mobile 的导航栏组件
 * @author Uni
 * @since 1.0
 */

import { Link, useNavigate } from 'react-router-dom'

import { BottomNavigation, BottomNavigationAction } from '@mui/material'
import { useState } from 'react'
import { COLOR } from '../styles'

export default function NavBar() {

    const [value, setValue] = useState('/')

    const navigate = useNavigate()

    const handleChange = (e, newValue) => {
        setValue(newValue)
        navigate(newValue)
    }

    return (
        <BottomNavigation sx={style} value={value} onChange={handleChange}>
            <BottomNavigationAction style={{color: COLOR.title}} label="聊天列表" value="/"/>
            <BottomNavigationAction style={{color: COLOR.title}} label="通讯录" value="/relation"/>
            <BottomNavigationAction style={{color: COLOR.title}} label="动态" value="/social"/>
            <BottomNavigationAction style={{color: COLOR.title}} label="设置" value="/setting"/>
        </BottomNavigation>
    )
}


// Navbar style
const style = {
    width: "100%",
    height: "8vh",
    position: "absolute",
    bottom: "0",
    backgroundColor: COLOR.bg,
    borderTop: `1px solid ${COLOR.border}`
}