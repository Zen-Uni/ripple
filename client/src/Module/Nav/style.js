/**
 * @description nav bar styles
 */

import styled from '@emotion/styled'

export const NavWrapepr = styled.div`
    position: relative;
    height: 100%;
    width: 80px;
    /* background-color: rgba(143,188,143, .8); */
    background-color: rgba(0,139,139, 0.8);

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

    & #tip {
        cursor: pointer;
        position: absolute;
        bottom: 60px;
        align-items: center;
        & i {
            font-size: 25px;
            color: white;
        }
        & .have-message {
            position: absolute;
            right: 0px;
            top: 5px;
            height: 5px;
            width: 5px;
            border-radius: 5px;
            background-color: red;
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