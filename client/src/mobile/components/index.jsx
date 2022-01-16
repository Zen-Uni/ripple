import {  Outlet, useNavigate } from "react-router";
import { Button } from '@mui/material'
export function Test1() {
    return (
        <div>
            <div>this is test1</div>
            <Outlet/>
        </div>
    )
}

export function Test2() {
    return (
        <div>this is test2</div>
    )
}

export function Test3() {
    const auth = false
    const navigate = useNavigate()
   
    return (
        <Button onClick={() => navigate('/test2')}>
            Test2
        </Button>
    )
}