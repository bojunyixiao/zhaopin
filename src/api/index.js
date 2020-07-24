/*
接口请求函数
*/
import jsonp from 'jsonp'
import {message} from 'antd'

import ajax from './ajax'

// 登录(以下都为箭头函数)
export const reqLogin = (username,password) => ajax('./login',{username,password},'POST')

/**
 * json请求的接口请求函数
 */
export const reqWeather = (city) => {
    return new Promise((resole,reject) =>{
        const url = 'http://api.map.baidu.com/telematics/v3/weather?location='+city+'&output=json&ak=3p49MVra6urFRGOT9s8UBWr2'
        jsonp(url,{},(err,data)=>{
            //如果成功了
            if(!err && data.status === 'success'){
                //取出需要的数据
                const {dayPictureUrl,weather} = data.results[0].weather_data[0]
                resole({dayPictureUrl,weather})
            }else{
            //如果失败了
            message.error('获取天气信息失败！')
            }
        })
    })
}