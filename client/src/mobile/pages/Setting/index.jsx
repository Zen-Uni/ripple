/**
 * @description 设置页面根组件
 * @author Uni 
 * @since 1.0
 */

import { Button } from "@mui/material";
import { connect } from "react-redux";
import { useNavigate } from "react-router";
import AvatarModify from "./AvatarModify";
import TextModify from "./TextModify";

function Setting(props) {
    // const navigate = useNavigate()
    // const handleModify = () => {
    //     navigate('/modify')
    // }
    const { avatar, username, email, headline, id } = props

    // 渲染配置项，type: 0（头像类型子项）、1（文字类型子项）
    const item_type = {
        avatar: 0,
        text: 1
    }
    const config = [
        {
            title: "头像",
            type: item_type.avatar,
            value: avatar
        },
        {
            title: "用户名",
            type: item_type.text,
            value: username
        },
        {
            title: "邮箱",
            type: item_type.text,
            value: email
        },
        {
            title: "签名",
            type: item_type.text,
            value: headline
        },
        {
            title: "更改密码",
            type: item_type.text,
            value: null
        }
    ]


    return (
        <>
            {
                config.map(item => {
                    return (
                        item.type === item_type.text ? 
                        <TextModify value={item.value} title={item.title} key={item.title}/>
                        :
                        <AvatarModify value={item.value} title={item.title} key={item.title}/>
                    )
                })
            }
        </>
    )
}

const stateToProps = state => {
    return {
        avatar: state.avatar_url,
        username: state.username,
        email: state.email,
        headline: state.headline,
        id: state.id
    }
}

export default connect(stateToProps, null)(Setting)