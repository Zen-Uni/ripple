/**
 * @description Main Page basic style
 */

import styled from '@emotion/styled';
import BG from '../../static/bg.jpeg'

export const MainWrapper = styled.div`
    & #loading {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
`  


export const ContainerWrapper = styled.div`
    position: fixed;
    height: 100%;
    width: 100%;
    background-image: url("${BG}");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    align-items: center;
    justify-content: center;
    display: flex;
`

export const ChatWrapper = styled.div`
    height: 650px;
    width: 1000px;
    overflow: hidden;
    border-radius: 7px;
    background-color: rgba(255,255,255,.6);
    box-shadow: 0px 0px 40px rgba(0,0,0,.5);
    display: flex;
    justify-content: center;
`