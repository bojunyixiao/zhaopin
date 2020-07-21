/*
接口请求函数
*/
import ajax from './ajax'

// 登录(以下都为箭头函数)
export const reqLogin = (username,password) => ajax('./login',{username,password},'POST')