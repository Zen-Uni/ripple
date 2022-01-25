import { RequestApi } from '.'

export const postFileImg = async (file) => {
    const formData = new FormData()
    formData.set('file', file)
    return await new RequestApi()
        .withAuth()
        // TODO host外置, path外置
        .setUrl('http://localhost:3001/file/img')
        .post(formData)
}

export const postFileImgs = async (files) => {
    const formData = new FormData()
    files.forEach((ele) => {
        formData.append('file', ele)
    })
    return await new RequestApi()
        .withAuth()
        // TODO host外置, path外置
        .setUrl('http://localhost:3001/file/imgs')
        .post(formData)
}
