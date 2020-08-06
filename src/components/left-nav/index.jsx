import React, { Component } from 'react'
import {Link,withRouter} from 'react-router-dom'
import { Menu } from 'antd';

import login from '../../assets/images/logo.png'
import './index.less'
import menuList from '../../config/menuConfig/menuConfig'

const { SubMenu } = Menu;
/**
 * 左侧导航组件
 */
class LeftNav extends Component {
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
        return menuList.reduce((pre,item) => {
            const path = this.props.location.pathname
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

