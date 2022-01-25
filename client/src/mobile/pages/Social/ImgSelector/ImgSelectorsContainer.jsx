/**
 * @description 多个图片选择上传组件
 * @author Hans
 * @since 1.0
 */

/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'
import { useEffect } from 'react'
import { useReducer } from 'react'
import { postFileImgs } from '../../../../utils/request/file'
import ImgSelector from './ImgSelector'

const INITIAL_FAKE_FILE = 'INITIAL_FAKE_FILE'
const gainInitialFiles = () => ({ 0: INITIAL_FAKE_FILE })
const gainLastKey = (obj) => {
    const keys = Reflect.ownKeys(obj)
    return keys[keys.length - 1]
}

const reducer = (state, action) => {
    const { type, payload: { value, key, callback } = {} } = action
    switch (type) {
        case 'files/append':
            state[key] = value
            state[Number(key) + 1] = INITIAL_FAKE_FILE
            return { ...state }
        case 'files/appendLot':
            let lastKey = Number(gainLastKey(state))
            for (const file of value) {
                state[lastKey] = file
                state[++lastKey] = INITIAL_FAKE_FILE
            }
            return { ...state }
        case 'files/remove':
            delete state[key]
            return { ...state }
        case 'files/update':
            state[key] = value
            return { ...state }
        case 'files/post':
            postFileImgs(Object.values(state).slice(0, -1)).then((v) => {
                callback(v)
            })
            return gainInitialFiles()
        default:
            return
    }
}

function ImgSelectorsContainer() {
    const [files, dispatch] = useReducer(reducer, gainInitialFiles())

    const handleDrop = (e) => {
        e.preventDefault()
        const clipboardFiles = e.dataTransfer.files
        if (clipboardFiles.length < 2) return
        for (const file of clipboardFiles) {
            if (!/image\//.test(file.type)) {
                // TODO 提示格式错误
                return
            }
        }
        dispatch({
            type: 'files/appendLot',
            payload: {
                value: clipboardFiles,
            },
        })
    }

    useEffect(() => console.log(files))

    return (
        <div onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
            {Object.entries(files).map((ele) => {
                const [key, file] = ele
                return (
                    <ImgSelector
                        css={css`
                            margin: 0 0.5rem;
                        `}
                        filesDispatch={dispatch}
                        xKey={key}
                        key={key}
                        img={file}
                    ></ImgSelector>
                )
            })}

            <button
                onClick={() =>
                    dispatch({
                        type: 'files/post',
                        payload: {
                            callback: (res) => {
                                console.log(res)
                                // TODO 提示文件上传成功
                            },
                        },
                    })
                }
            >
                上传
            </button>
        </div>
    )
}
// export const dispatch

export default ImgSelectorsContainer
