/**
 * @description 登录注册页面的样式控制
 * @author Uni
 * @since 1.0
 */

import styled from '@emotion/styled'
import { TextField } from '@mui/material'

const background_color = "#F3F4F2",
      title_color = "#7E7E7E",
      switch_button_color = "#505050",
      border_color = "#CBCBC9"


export const LoginAndRegisterWrapper = styled.div`
    /* background-color: pink; */
    position: absolute;
    height: 100vh;
    width: 100vw;
    & .login-enter {
        opacity: 0;
        transform: scale(0.9);
    }
    & .login-enter-active {
        opacity: 1;
        transform: translateX(0);
        transition: opacity 300ms, transform 300ms;
    }
    & .login-exit {
        opacity: 1;
    }
    & .login-exit-active {
        opacity: 0;
        transform: scale(0.9);
        transition: opacity 300ms, transform 300ms;
    }

    & .register-enter {
        opacity: 0;
        transform: scale(0.9);
    }
    & .register-enter-active {
        opacity: 1;
        transform: translateX(0);
        transition: opacity 300ms, transform 300ms;
    }
    & .register-exit {
        opacity: 1;
    }
    & .register-exit-active {
        opacity: 0;
        transform: scale(0.9);
        transition: opacity 300ms, transform 300ms;
    }
`

// 表单组件的容器样式
export const ContainerWrapper = styled.div`
    position: absolute;
    background-color: ${background_color};
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;

    & .container {
        position: relative;
        /* height: 60vh; */
        width: 80vw;
    }

    & .title {
        position: absolute;
        height: 10vh;
        width: 100%;
        font-size: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: ${title_color};
        top: -10vh;
    }

    & .form .submit-button {
        height: 40px;
        width: 120px;
        background-color: rgba(0, 0, 0, .8);
        border-radius: 20px;
        margin: 20px auto;
        color: whitesmoke;
        font-size: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    & .form .captcha {
        display: flex;
        align-items: center;
        justify-content: space-between;
        & .captcha-button {
            height: 5vh;
            width: 35%;
            border-radius: 2.5vh;
            transform: translate(0, 1vh);
            font-size: 14px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(0, 0, 0, .8);
            color: rgba(255, 255, 255, .9);
        }
  
    }

    & .switch-button {
        height: 7vh;
        width: 100%;
        position: absolute;
        bottom: -9vh;
        /* background-color: pink; */
        color: ${switch_button_color};
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 18px;
    }
`

// 对 TextField 组件进行封装
export const CSSField = styled(TextField)({
    height: '5vh',
    margin: '3vh 0',
    width: '100%',
    '& label': {
        color: border_color,
        
    },   
    '& label.Mui-focused': {
        color: title_color,
        fontWeight: 600
    },
    '& label.MuiFormLabel-filled': {
        color: title_color,
        fontWeight: 600
    },
    '& .MuiInput-root:before': {
        borderBottomColor: border_color
      },
    '& .MuiInput-underline:after': {
    borderBottomColor: title_color,
    },

    '&.captcha-style': {
        width: '60%'
    }
})