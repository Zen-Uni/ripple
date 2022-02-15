/**
 * @description 公共页面标题组件
 * @author Uni
 * @since 1.0
 */

import { useEffect, useState } from "react";
import { TitleWrapper } from "./index";

const TITLE_MAP = {
    '/': "Ripple",
    '/relation': "通讯录",
    '/social': "社交",
    '/setting': "设置"
}

export default function Tittle() {

    const globalEvent = window.event_emitter

    const [text, setText] = useState('/')

    const onEventHandle = (value) => {
        setText(value)
    }

    useEffect(() => {
        globalEvent.on('title_value', onEventHandle)
    }, [])
    console.log(globalEvent)

    return (
        <TitleWrapper>
            {TITLE_MAP[text]}
        </TitleWrapper>
    )
}