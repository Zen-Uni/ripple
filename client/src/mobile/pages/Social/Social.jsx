/**
 * @description 集中导出社交功能的页面
 * @author Uni
 * @since 1.0
 */

import { Button } from '@mui/material'
import { useNavigate } from 'react-router'
import ImgSelectorsContainer from './ImgSelector/ImgSelectorsContainer'

export default function Social() {
    const navigate = useNavigate()
    const handleMoment = () => {
        navigate('/moment')
    }
    const handleRipple = () => {
        navigate('/ripple')
    }
    return (
        <>
            <div>this is Social page</div>
            <Button variant="contained" onClick={handleMoment}>
                动态
            </Button>
            <Button variant="contained" onClick={handleRipple}>
                Ripple
            </Button>
            <ImgSelectorsContainer></ImgSelectorsContainer>
        </>
    )
}
