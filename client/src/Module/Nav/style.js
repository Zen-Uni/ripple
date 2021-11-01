/**
 * @description nav bar styles
 */

import styled from '@emotion/styled'

export const NavWrapepr = styled.div`
    position: relative;
    height: 100%;
    width: 80px;
    /* background-color: rgba(143,188,143, .8); */
    background-color: rgba(0,139,139, 0.9);

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

        & #req-list {
            position: absolute;
            left: 45px;
            /* top:800px; */
            top: -220px;
            height: 300px;
            width: 240px;
            background-color: rgba(255, 255, 255, .6);
            overflow-y: hidden;
            overflow-x: hidden;
            z-index: 100;
            border-radius: 7px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, .5);
            scrollbar-width: none;
            -ms-overflow-style: none; 
            ::-webkit-scrollbar {
                display: none; 
            }
            cursor: auto;
            & #req-list-cancel {
                position: absolute;
                right: 7px;
                top: 5px;
                padding: 2px 5px;
                cursor: pointer;
                & i {
                    font-size: 14px;
                    color: black;
                }

                &:hover {
                    background-color: white;
                }
            }
            & .req-list-title {
                height: 30px;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            & .req-item-box {
                overflow-y: auto;
                overflow-x: hidden;
                width: 100%;
                height: 270px;
                scrollbar-width: none;
                -ms-overflow-style: none; 
                ::-webkit-scrollbar {
                    display: none; 
                }
                /* background-color: pink; */
                /* margin-top: 30px; */
                & .req-item {
                    position: relative;
                    height: 60px;
                    width: 100%;
                    /* background-color: yellow; */
                    & div {
                        position: absolute;
                    }
                    & .req-item-avatar {
                        height: 50px;
                        width: 50px;
                        /* background-color: black; */
                        border-radius: 50px;
                        top: 5px;
                        left: 5px;
                        background-position: center;
                        background-repeat: no-repeat;
                        background-size: cover;
                    }

                    & .req-item-username {
                        left: 70px;
                        height: 40px;
                        top: 10px;
                        width: 100px;
                        line-height: 40px;
                        font-size: 14px;
                        /* background-color: black; */
                    }

                    & .req-item-select {
                        height: 40px;
                        width: 60px;
                        /* background-color: pink; */
                        right: 5px;
                        top: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: space-around;
                        & .iconfont {
                            transition: all .3s ease;
                        }
                        & .iconfont:hover {
                            font-size: 30px;
                        }
                        & .icon-jujue {
                            color: rgba(220,20,60, .8);
                            cursor: pointer;
                        }
                        & .icon-tongyi1 {
                            color: rgba(60,179,113, .8);
                            cursor: pointer;
                        }
                    }
                }
            }
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

