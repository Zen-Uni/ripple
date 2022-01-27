/**
 * @description CSS transition 样式
 * @author Hans
 * @since 1.0
 */

import { css } from '@emotion/react'

export const durations = {
    'move-x': 300,
}

export const style = css`
    .move-x-enter-from {
        left: 100vw;
    }
    .move-x-enter-to {
        left: 0;
    }
    .move-x-leave-from {
        left: 0;
    }
    .move-x-leave-to {
        left: 100vw;
    }
    .move-x-enter-active,
    .move-x-leave-active {
        transition: left ${durations['move-x']}ms;
    }
`
