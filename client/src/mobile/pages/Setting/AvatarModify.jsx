/**
 * @description 头像修改子项组件
 * @author Uni
 * @since 1.0
 */

import { useRequest } from "ahooks"
import { fetchUploadImg } from "../../service/users"
import { AvatarWrapper } from "./style"

const handleFileSelect = (e, run) => {
    console.log(e.target.files)
    run({ file: e.target.files[0] })
}

function AvatarModify(props) {
    const { title, value } = props

    const { run: runUpload } = useRequest(fetchUploadImg, {
        manual: true,
        onSuccess({ data }) {
            console.log(data)
        },
        onError(err) {
            console.log(err)
        }
    })

    return (
        <AvatarWrapper>
        <div className="title left">{title}</div>

        <div className="right"><i className="iconfont icon-arrow-right"></i></div>

        <div className="right">
            <img className="content" src={value}/>
            <input type="file" onChange={e => handleFileSelect(e, runUpload)}/>
        </div>
        </AvatarWrapper>
    )
}

export default AvatarModify