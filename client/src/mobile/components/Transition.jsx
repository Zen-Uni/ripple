/**
 * @description 组件enter和leave时使用CSS transition, 通过isVisible控制
 * @author Hans
 * @since 1.0
 */

/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'
import { useEffect, useState } from 'react'
import PropType from 'prop-types'

export function Transition(props) {
    const {
        isVisible,
        name,
        child,
        duration,
        className: originalClassName,
        ...originalProps
    } = props
    const [wrapperClass, setWrapperClass] = useState('')
    const [isVisibleCopy, setIsVisibleCopy] = useState(isVisible)
    const [status, setStatus] = useState(0)
    /**
     * status:
     * 0: 首次渲染<Transition />
     * 1: 在DOM中添加child, 准备enter动画
     * 2: 开始enter动画
     * 3: 完成enter动画
     * 4: 准备leave动画
     * 5: 开始leave动画
     * 6: 完成leave动画, 并从DOM中移除child
     */

    useEffect(() => {
        if (isVisible) {
            setWrapperClass([originalClassName, `${name}-enter-to`].join(' '))
            setStatus(3)
        } else {
            setWrapperClass([originalClassName, `${name}-leave-to`].join(' '))
            setStatus(6)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        if (status === 0) return
        if (isVisible) {
            setIsVisibleCopy(true)
            setStatus(1)
        } else {
            setStatus(4)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVisible])
    useEffect(() => {
        let timer = null
        if (status === 1) {
            setWrapperClass(
                [
                    originalClassName,
                    `${name}-enter-from`,
                    `${name}-enter-active`,
                ].join(' '),
            )
            setStatus(2)
        } else if (status === 2) {
            setWrapperClass((prev) =>
                [...prev.split(' '), `${name}-enter-to`].join(' '),
            )
            timer = setTimeout(() => {
                setWrapperClass(
                    [originalClassName, `${name}-enter-to`].join(' '),
                )
                setStatus(3)
            }, duration)
        } else if (status === 4) {
            setWrapperClass(
                [
                    originalClassName,
                    `${name}-leave-from`,
                    `${name}-leave-active`,
                ].join(' '),
            )
            setStatus(5)
        } else if (status === 5) {
            setTimeout(() =>
                setWrapperClass((prev) =>
                    [...prev.split(' '), `${name}-leave-to`].join(' '),
                ),
            )
            timer = setTimeout(() => {
                setWrapperClass(
                    [originalClassName, `${name}-leave-to`].join(' '),
                )
                setIsVisibleCopy(false)
                setStatus(6)
            }, duration)
        }

        return () => {
            clearTimeout(timer)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status])

    return (
        <>
            {isVisibleCopy && (
                <div className={wrapperClass} {...originalProps}>
                    {child}
                </div>
            )}
        </>
    )
}

Transition.propTypes = {
    isVisible: PropType.bool.isRequired,
    name: PropType.string.isRequired,
    duration: PropType.number.isRequired,
    child: PropType.node.isRequired,
    className: PropType.string,
}

export default Transition
