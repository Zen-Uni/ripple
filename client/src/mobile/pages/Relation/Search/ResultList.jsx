/**
 * @description 搜索结果列表
 * @author Hans
 * @since 1.0
 */

/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'
import { useState } from 'react'
import { List } from '@mui/material'
import { TypeResultListProps } from './type'
import ResultListItem from './ResultListItem'
import Transition from '../../../components/Transition'
import { style as animationStyle, durations } from './animation'

// TODO 根据props.status显示好友申请状态

function ResultList(props) {
    const { setHandleClickGoBack, result, title } = props
    const [isCheckMore, setIsCheckMore] = useState(false)
    const handleClickCheckMore = () => {
        setIsCheckMore(true)
        setHandleClickGoBack((prev) => () => {
            setIsCheckMore(false)
            setHandleClickGoBack(() => prev)
        })
    }

    const ResultListItems =
        result === null
            ? null
            : result.map((v) => (
                  <ResultListItem
                      key={v.email}
                      avatarURL={v.avatarURL}
                      email={v.email}
                      tip={v.tip}
                  ></ResultListItem>
              ))

    const listStyle = css`
        position: relative;
        padding: 11px 0;
        .title {
            padding: 0 11px 11px;
            font-size: 0.9rem;
            span:nth-of-type(1) {
                color: grey;
            }
            span:nth-of-type(2) {
                float: right;
                cursor: pointer;
            }
        }
        .more {
            padding-top: 11px;
            position: absolute;
            top: 0;
            background: white;
            z-index: 99;
        }
        .no-result {
            color: #c0c0c0;
            margin: 0 auto;
            font-size: 0.8rem;
            text-align: center;
        }
    `

    return (
        result !== null && (
            <List css={[listStyle, animationStyle]}>
                <div className="title">
                    <span>{title}</span>
                    {result.length > 3 && (
                        <span onClick={handleClickCheckMore}>查看更多</span>
                    )}
                </div>
                {result.length > 0 ? (
                    ResultListItems.slice(0, 3)
                ) : (
                    <div className="no-result">这里空空如也</div>
                )}
                <Transition
                    className="more"
                    name="move-x"
                    duration={durations['move-x']}
                    isVisible={isCheckMore}
                    child={
                        <>
                            <div className="title">
                                <span>{title}</span>
                            </div>
                            {ResultListItems}
                        </>
                    }
                />
            </List>
        )
    )
}

ResultList.propTypes = TypeResultListProps

export default ResultList
