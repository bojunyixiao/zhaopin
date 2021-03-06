/*
接口请求函数
*/
import jsonp from 'jsonp'
import {message} from 'antd'

import ajax from './ajax'

// 登录(以下都为箭头函数)
export const reqLogin = (username,password) => ajax('/login',{username,password},'POST')

//获取一级/二级分类列表
export const reqCategorys = (parentId) => ajax('/manage/category/list',{parentId})

//添加分类
export const reqAddCategory = (parentId,categoryName) => ajax('/manage/category/add',{parentId,categoryName},'POST')

//更新分类
export const reqUpdateCategory = (categoryId,categoryName) => ajax('/manage/category/update',{categoryId,categoryName},'POST')

// 获取一个分类
export const reqCategory = (categoryId) => ajax('/manage/category/info', {categoryId})

//获取商品分页列表
export const reqProducts = (pageNum,pageSize) => ajax('/manage/product/list',{pageNum,pageSize})

//更新商品的状态(上架/下架)
export const reqUpdateStatus = (productId,status) => ajax('/manage/product/updateStatus',{productId,status},'POST')

//搜索商品分页列表
export const reqSearchProducts = (pageNum,pageSize,searchContent,searchType) => ajax('/manage/product/search',{
    pageNum,
    pageSize,
    searchContent,
    [searchType]:searchContent
})

//添加/修改商品(厉害了这个写法)
export const reqAddOrUpdateProduct = (product) => ajax('/manage/product/' + (product._id?'update':'add'),product,'POST')

//删除图片
export const reqDeleteImg = (name) => ajax('/manage/img/delete',{name},'POST')

//获取所有用户列表
export const reqUsers = () => ajax('/manage/user/list')

//添加/更新用户
export const reqAddOrUpdateUsers = (user) => ajax('/manage/user/' + (user._id?'update':'add'),user,'POST')

//删除用户
export const reqDeleteUsers = (userId) => ajax('/manage/user/delete',{userId},'POST')

//获取所有角色的列表
export const reqRoles = () => ajax('/manage/role/list')

//添加角色
export const reqAddRole = (roleName) => ajax('/manage/role/add',{roleName},'POST')

//更新角色（给角色设置权限）
export const reqUpdataRole = (role) => ajax('/manage/role/update',role,'POST')

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