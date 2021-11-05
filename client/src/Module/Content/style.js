/**
 * @description content's style
 */

import styled from "@emotion/styled";

export const ContentWrapper = styled.div`
    position: relative;
    height: 100%;
    width: 640px;
    /* background-color: black; */
    & .message-box-title {
        position: sticky;
        top: 0;
        height: 50px;
        width: 100%;
        /* background-color: rgba(95,158,160, 1); */
        background-color: rgba(255,255,255, .4);
        
        display: flex;
        justify-content: center;
        align-items: center;
    }
`

export const MessageBox = styled.div`
    position: relative;
    height: 85%;
    width: 100%;
    /* background-color: black; */
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 0px;

    &::-webkit-scrollbar {
        width: 4px;    
        /*height: 4px;*/
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background: rgba(0,0,0,0.1);
    }
    &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 0;
        /* background: rgba(0,0,0,0.1); */

    }

    

    & .message-box {
        /* height: 50px; */
        width: 100%;
        /* background-color: pink; */
        overflow: hidden;
        margin: 10px 0px;
    }

    & .message-box-left {
        padding-left: 10px;
        & div {
            float: left;
        }
    }

    & .message-box-right {
        padding-right: 10px;
       
        & div {
            float: right;
        }
    }


    & .message-avatar {
        height: 50px;
        width: 50px;
        border-radius: 50px;
        /* background-color: black; */
        /* float: left; */
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
    }

    & .message-context {
        margin-left: 20px;
        margin-right: 20px;
        margin-top: 20px;
        /* height: 100px; */
        max-width: 240px;
        word-wrap: break-word;
        padding: 10px;
        box-sizing: border-box;
        /* float: left; */
        background-color: rgba(255, 255, 255, .8);
        border-radius: 10px;
    }
`


// 聊天框样式
export const ChatBox = styled.div`
    position: relative;
    height: 15%;
    width: 100%;
    background-color: rgba(255, 255, 255, .7);
    box-sizing: border-box;
    padding: 10px 5px 5px 10px;
    overflow-y: hidden;
    & #chat-input {
        position: relative;
        height: 100%;
        width: 100%;
        box-direction: none;
        outline: none;
        overflow-y: auto;
        &:empty::before {
            content: attr(placeholder);
            color: rgba(0, 0, 0, .5)
        }
    }
`   
