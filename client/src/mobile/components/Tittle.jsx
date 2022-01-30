/**
 * @description 公共页面标题组件
 * @author Uni
 * @since 1.0
 */

import { TitleWrapper } from "./index";

const TITLE_MAP = {
    '/': "Ripple",
    '/relation': "通讯录",
    '/social': "社交",
    '/setting': "设置"
}

export default function Tittle() {

    const text = (
        <div>{TITLE_MAP[1]}</div>
    )

    return (
        <TitleWrapper>
            {text}
        </TitleWrapper>
    )
}