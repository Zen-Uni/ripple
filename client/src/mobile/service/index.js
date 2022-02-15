/**
 * @description 网络请求相关
 * @author Uni
 * @since 1.0
 */


// TODO 
import axios from 'axios'

const rootUrl = 'http://localhost:8080/api'

class Fetch {
    constructor(baseUrl) {
        this.baseUrl = rootUrl + baseUrl
    }

    get(url) {
        const basic = this.baseUrl + url
        return (data, query) => {
            let api = basic
            if (query !== undefined) {
                api = api + query
            }
            return axios.get(api, data)
        }
    }

    post(url) {
        const basic = this.baseUrl + url
        return (data, query) => {
            let api = basic
            if (query !== undefined) {
                api = api + query
            }
            return axios.post(api, data)
        }
    }

    patch(url) {
        url = this.baseUrl + url
        return (data, query) => {
            if (query !== undefined) {
                url = url + query
            }
            return axios.patch(url, data)
        }
    }
}

export default Fetch