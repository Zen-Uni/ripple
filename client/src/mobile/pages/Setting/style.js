/**
 * @description 修改个人信息页面样式
 * @author Uni
 * @since 1.0
 */

import styled from '@emotion/styled'

// 文本类型样式
export const TextWrapper = styled.div`
    height: 7vh;
    width: 100vw;
    background-color: white;
    overflow: hidden;
    box-sizing: border-box;
    padding: 0px 3vw;
    margin: .2vh 0px;
    & > .left {
        float: left;
        display: flex;
        height: 100%;
        align-items: center;
    }

    & > .right {
        float: right;
        height: 100%;
        display: flex;
        align-items: center;
        margin: 0 0 0 2vw;
    }
`

export const AvatarWrapper = styled.div`
    height: 10vh;
    width: 100vw;
    background-color: white;
    overflow: hidden;
    box-sizing: border-box;
    padding: 0px 3vw;
    margin: .2vh 0px;
    & > .left {
        float: left;
        display: flex;
        height: 100%;
        align-items: center;
    }

    & > .right {
        float: right;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 0 0 2vw;
        overflow: hidden;
    }

    & .content {
        height: 8vh;
        width: 8vh;
        border-radius: 3px;
        overflow: hidden;
    }

    & input {
        position: absolute;
        opacity: 0;
    }
`