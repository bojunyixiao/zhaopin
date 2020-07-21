/*
封装的axios库
*/
import axios from 'axios'

export default function ajax(url,data={},type='GET') {
    // 1、执行异步ajax请求
    if(type === 'GET'){//发get请求
        return axios.get(url, {
            params: data
            })
    }else{//发post请求
        return axios.post(url, data)
    }
}

