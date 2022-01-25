/**
 * @description 单个图片选择上传组件
 * @author Hans
 * @since 1.0
 */

/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'
import PropType from 'prop-types'
import { IconButton, SvgIcon } from '@mui/material'
import { useEffect, useRef } from 'react'
import { useState } from 'react'

function ImgSelector(props) {
    const { filesDispatch, xKey, img, ...outerProps } = props
    const refInput = useRef(null)
    const [imgSrc, setImgSrc] = useState(null)
    const [isSelectImg, setIsSelectImg] = useState(false)

    const setPreview = (file) => {
        setIsSelectImg(true)
        setImgSrc(window.URL.createObjectURL(file))
    }
    const resetPreview = () => {
        setIsSelectImg(false)
        setImgSrc(null)
        window.URL.revokeObjectURL(imgSrc)
        refInput.current.value = null
    }
    const appendFile = (file) => {
        filesDispatch({
            type: isSelectImg ? 'files/update' : 'files/append',
            payload: {
                value: file,
                key: xKey,
            },
        })
        setPreview(file)
    }

    const handleClickAddImg = () => {
        refInput.current.click()
    }
    const handleClickRemoveImg = () => {
        resetPreview()
        filesDispatch({
            type: 'files/remove',
            payload: {
                key: xKey,
            },
        })
    }
    const handleChange = async (e) => {
        const file = e.target.files[0]
        appendFile(file)
    }
    const handleDrop = (e) => {
        e.preventDefault()
        const files = e.dataTransfer.files
        if (files.length > 1) return
        if (!/image\//.test(files[0].type)) {
            // TODO 提示格式错误
            return
        }
        appendFile(files[0])
    }

    useEffect(() => {
        if (img instanceof File) setPreview(img)
        else if (typeof img === 'string') resetPreview()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [img])

    return (
        <>
            <div
                css={css`
                    display: inline-block;
                    position: relative;
                `}
                {...outerProps}
            >
                <IconButton
                    css={css`
                        border: 1px solid rgba(25, 118, 210, 0.5);
                        border-radius: 4px;
                        height: 100px;
                        width: 100px;
                    `}
                    onClick={handleClickAddImg}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                >
                    {isSelectImg ? (
                        <img
                            src={imgSrc}
                            alt=""
                            css={css`
                                height: 100px;
                                width: 100px;
                                object-fit: cover;
                            `}
                        />
                    ) : (
                        <SvgIcon
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            color="primary"
                            css={css`
                                font-size: 44px;
                            `}
                        >
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                        </SvgIcon>
                    )}
                </IconButton>
                {isSelectImg && (
                    <IconButton
                        css={css`
                            position: absolute;
                            top: -0.6rem;
                            right: -0.6rem;
                            padding: 1px;
                            background-color: #d32f2f;
                            &:hover {
                                background-color: #ee9797;
                            }
                        `}
                        onClick={handleClickRemoveImg}
                    >
                        <SvgIcon
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            css={css`
                                font-size: 1.2rem;
                                color: white;
                            `}
                        >
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                        </SvgIcon>
                    </IconButton>
                )}
            </div>
            <input
                type="file"
                accept="image/*"
                ref={refInput}
                css={css`
                    display: none;
                `}
                onChange={handleChange}
            ></input>
        </>
    )
}

ImgSelector.propTypes = {
    filesDispatch: PropType.func.isRequired,
    xKey: PropType.string.isRequired,
    img: PropType.oneOfType([PropType.string, PropType.instanceOf(File)]),
}

export default ImgSelector
