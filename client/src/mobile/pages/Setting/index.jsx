/**
 * @description 设置页面根组件
 * @author Uni 
 * @since 1.0
 */

import { Button } from "@mui/material";
import { useNavigate } from "react-router";

export default function Setting() {
    const navigate = useNavigate()
    const handleModify = () => {
        navigate('/modify')
    }

    return (
        <>
             <div>this is Setting Page</div>
             <Button onClick={handleModify} variant="contained">
                 修改个人信息
             </Button>
        </>
    )
}