/**
 * @description nav bar styles
 */

import styled from '@emotion/styled'

export const NavWrapepr = styled.div`
    position: relative;
    height: 100%;
    width: 80px;
    background-color: rgba(143,188,143, .8);
    justify-content: center;
    display: flex;
    & #avatar {
        position: absolute;
        top: 30px;
        height: 65px;
        width: 65px;
        border-radius: 65px;
        /* background-color: black; */
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        overflow: hidden;
        cursor: pointer;
        & input {
            position: relative;
            height: 100%;
            width: 100%;
            opacity: 0;
            cursor: pointer;
        }
    }

    & #logout {
        cursor: pointer;
        position: absolute;
        bottom: 10px;
        text-align: center;
        & i {
            font-size: 25px;
            color: white;
        }
    }
`