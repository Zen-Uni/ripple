/**
 * @description Sign Page style
 */

import styled from '@emotion/styled'

export const SignWrapper = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    /* background-color: pink; */
    display: flex;
    align-items: center;
    justify-content: center;

    & .container {
        overflow: hidden;
        width: 300px;
        margin: -30px 0px 0px 0px;
    }

    & .title {
        color: #00CED1;
        font-weight: 600;
        font-size: 50px;
        text-align: center;
        margin: -20px 0px 20px 0px;
    }
`

