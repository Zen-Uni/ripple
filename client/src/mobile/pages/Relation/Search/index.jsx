/**
 * @description 通讯录列表的搜索组件
 * @author Hans
 * @since 1.0
 */

/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */

import { useState, useCallback } from 'react'
import { css } from '@emotion/react'
import {
    InputBase,
    IconButton,
    SvgIcon,
    Divider,
    CircularProgress,
    Fade,
} from '@mui/material'
import ResultList from './ResultList'
import Transition from '../../../components/Transition'
import { style as animationStyle, durations } from './animation'
import { getUserSearch } from '../../../../utils/request/user'
import { getRelationSearch } from '../../../../utils/request/relation'
import { debounce } from '../../../../utils/helper'

const InitialResults = {
    global: null,
    friends: null,
    groups: null,
}

export default function Search() {
    const [isLoading, setIsLoading] = useState(false)
    const [isShowDetail, setIsShowDetail] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [results, setResults] = useState(InitialResults)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const requestSearch = useCallback(
        debounce(async (value) => {
            console.log(1)
            setIsLoading(true)
            await Promise.all(
                getUserSearch({
                    email: value,
                }).then((res) => {
                    const { users } = res
                    setResults((prev) => ({ ...prev, users }))
                }),
                getRelationSearch({
                    keyword: value,
                }).then((res) => {
                    const { friends, groups } = res
                    setResults((prev) => ({
                        ...prev,
                        friends,
                        groups,
                    }))
                }),
            )
                .catch(() => {
                    // TODO 请求错误处理
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }, 500),
        [],
    )

    const handleChange = (e) => {
        const {
            target: { value },
        } = e
        setInputValue(value)
        value !== '' && requestSearch(value)
    }
    const handleClickClean = () => {
        setInputValue('')
    }
    const [handleClickGoBack, setHandleClickGoBack] = useState(() => () => {
        setIsShowDetail(false)
        setInputValue('')
    })

    const styleSearchBar = css`
        // 使用Styled Components存在问题，表现为<input>的每一次change都会导致blur，怀疑是重新进行了渲染
        // -Hans
        display: flex;
        justify-content: space-between;
        align-items: center;
        * {
            padding: 0;
        }
        .button-back {
            svg {
                font-size: 44px;
            }
        }
        .button-clean {
            padding: 11px;
            svg {
                fill: #bbbbbb;
                font-size: 22px;
            }
        }
        .input-keyword {
            width: calc(100% - 88px);
        }
    `

    const searchBar = (
        <div css={styleSearchBar}>
            <IconButton onClick={handleClickGoBack} className="button-back">
                <SvgIcon viewBox="0 0 16 16">
                    <path d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z" />
                </SvgIcon>
            </IconButton>
            <InputBase
                key="input-keyword"
                placeholder="搜索"
                className="input-keyword"
                value={inputValue}
                onChange={handleChange}
            ></InputBase>
            <IconButton onClick={handleClickClean} className="button-clean">
                <SvgIcon viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
                </SvgIcon>
            </IconButton>
        </div>
    )
    const resultLists = (
        <>
            <ResultList
                title="查找"
                result={results.global}
                setHandleClickGoBack={setHandleClickGoBack}
            ></ResultList>
            <ResultList
                title="好友"
                result={results.friends}
                setHandleClickGoBack={setHandleClickGoBack}
            ></ResultList>
            <ResultList
                title="群聊"
                result={results.groups}
                setHandleClickGoBack={setHandleClickGoBack}
            ></ResultList>
        </>
    )

    return (
        <div css={animationStyle}>
            <IconButton onClick={() => setIsShowDetail(true)}>
                <SvgIcon
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    css={css`
                        font-size: 22px;
                    `}
                >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </SvgIcon>
            </IconButton>
            <Transition
                css={css`
                    position: absolute;
                    height: 100vh;
                    width: 100vw;
                    top: 0;
                    background: white;
                `}
                className="wrapped"
                isVisible={isShowDetail}
                name="move-x"
                duration={durations['move-x']}
                child={
                    <>
                        {searchBar}
                        <Divider></Divider>
                        <Fade in={isLoading}>
                            <div
                                css={css`
                                    position: relative;
                                `}
                            >
                                <CircularProgress
                                    css={css`
                                        position: absolute;
                                        transform: translate(-50%, -50%);
                                        left: 50%;
                                        top: 33px;
                                    `}
                                    size={33}
                                    thickness={4}
                                ></CircularProgress>
                            </div>
                        </Fade>
                        <Fade in={!isLoading}>
                            <div>{resultLists}</div>
                        </Fade>
                    </>
                }
            />
        </div>
    )
}
