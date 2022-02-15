/**
 * @description 文本类型用户信息修改子项
 * @author Uni
 * @since 1.0
 */

import { TextWrapper } from "./style"

function TextModify(props) {
    const { title, value } = props
    return (
        <TextWrapper>
            <div className="title left">{title}</div>

            <div className="right"><i className="iconfont icon-arrow-right"></i></div>

            <div className="content right">{value}</div>
        </TextWrapper>
    )
}


export default TextModify