/**
 * @description 包装传入函数为防抖函数
 * @author Hans
 * @since 1.0
 * @param {function} fun - 要包装的函数
 * @param {number} delay - 防抖的时间, 单位ms
 * @returns {function}
 */
export const debounce = (fun, delay) => {
    let timer = null
    return (...args) => {
        if (timer !== null) clearTimeout(timer)
        timer = setTimeout(() => fun(...args), delay)
    }
}
