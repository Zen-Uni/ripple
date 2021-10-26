/**
 * @description post image function
 */

import { uploadAvatar } from "../fetch";
import { message } from 'antd';

export const handlePostImg = async (e, callback) => {
    const files = e.target.files;
    const formData = new FormData()
    formData.append('upImg', files[0])
    const { code, data, msg } =  await uploadAvatar(formData)
    if (!code) {
        callback(data.avatar);
        message.success(msg);
    } else {
        message.error(msg);
    }
}

