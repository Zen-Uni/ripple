/**
 * @description 一些公共组件的样式
 * @author Uni
 * @since 1.0
 */

import styled from '@emotion/styled'
import { COLOR } from '../styles'


// 非导航栏部分的容器样式
export const Wrapper = styled.div`
    height: 84vh;
    width: 100vw;

    background-color: ${COLOR.bg};
`

// 页面公共标题容器样式
export const TitleWrapper = styled.div`
    height: 8vh;
    width: 100vw;
    background-color: ${COLOR.title};
`

