import React, { Component } from 'react'
import {Link,withRouter} from 'react-router-dom'
import { Menu } from 'antd';

import login from '../../assets/images/logo.png'
import './index.less'
import menuList from '../../config/menuConfig/menuConfig'
import memoryUtils from '../../utils/memoryUtils'

const { SubMenu } = Menu;
/**
 * 左侧导航组件
 */
class LeftNav extends Component {
    /**
     * 判断当前登录用户对item是否有权限
     */
    hasAuth = (item) => {
        const {key,isPublic} = item
        const menus = memoryUtils.user.role.menus
        const username = memoryUtils.user.username

        /**
         * 1、如果当前用户是admin
         * 2、如果当前item是公开的
         * 3、当前用户有此item权限：key有没有在item中
         */
        if(username==='admin' || isPublic || menus.indexOf(key) !== -1){
            return true
        }else if(item.children){//4、如果当前用户有此item的某个子item的权限
            //find返回的是child的true的集合，indexOf返回的是布尔值（menus大child.key小）
            return !!item.children.find(child => menus.indexOf(child.key) !== -1)
        }
        return false
    }

    // map方法递归调用左侧菜单栏
    // getMenuNodes_map = (menuList) => {
    //     return menuList.map(item =>{
    //         if(!item.children){
    //             return (
    //                 <Menu.Item key={item.key} icon={item.icon}>
    //                     <Link to={item.key}>
    //                     {item.title}
    //                     </Link>
    //                 </Menu.Item>
    //             )
    //         }else{
    //             return (
    //                 <SubMenu key={item.key} icon={item.icon} title={item.title}>
    //                     {this.getMenuNodes(item.children)}
    //                 </SubMenu>
    //             )
    //         }
    //     })
    // }

    // reduce方法递归左侧菜单栏
    getMenuNodes = (menuList) => {
        //得到当前请求的路由路径
        const path = this.props.location.pathname

        return menuList.reduce((pre,item) => {
            //如果当前用户有item对应的权限，才需要显示对应的菜单项
            if(this.hasAuth(item)){
                if(!item.children){//数组累计的方法reduce+push
                    pre.push((
                        (
                            <Menu.Item key={item.key} icon={item.icon}>
                                <Link to={item.key}>
                                {item.title}
                                </Link>
                            </Menu.Item>
                        )
                    ))
                }else{
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)//防止出现刷新页面会左侧栏不展开情况
                    if(cItem){
                        this.openKey = item.key
                    }
                    pre.push((
                        <SubMenu key={item.key} icon={item.icon} title={item.title}>
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    ))
                }
            }
            return pre
        },[])
    }

    /**
     * 在第一次render之前执行一次
     */
    componentWillMount() {
        this.getMenuNodes = this.getMenuNodes(menuList)

    }

    render() {
        let path = this.props.location.pathname
        if(path.indexOf('/product')===0){//防止进入商品管理的详情页面会出现光标不选中情况
            path = '/product'
        }
        const openKey = this.openKey
        return (
            <div className="left-nav">
                <Link to='/' className="left-nav-header">
                    <img src={login} alt=""/>
                    <h1>硅谷后台</h1>
                </Link>
                <Menu mode="inline" theme="dark" selectedKeys={[path]} defaultOpenKeys={[openKey]}>
                    {this.getMenuNodes}
                </Menu>
            </div>
        )
    }
}
/**
 * 包装非路由组件，使其拥有：history/location/math 三个属性
 */
export default withRouter(LeftNav)

