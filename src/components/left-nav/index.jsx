import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import { Menu } from 'antd';

import login from '../../assets/images/logo.png'
import './index.less'
import menuList from '../../config/menuConfig/menuConfig'

const { SubMenu } = Menu;
/**
 * 左侧导航组件
 */
export default class LeftNav extends Component {
    getMenuNodes = (menuList) => {
        return menuList.map(item =>{
            if(!item.children){
                return (
                    <Menu.Item key={item.key} icon={item.icon}>
                        <Link to={item.key}>
                        {item.title}
                        </Link>
                    </Menu.Item>
                )
            }else{
                return (
                    <SubMenu key={item.key} icon={item.icon} title={item.title}>
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }
        })
    }
    render() {
        return (
            <div className="left-nav">
                <Link to='/' className="left-nav-header">
                    <img src={login} alt=""/>
                    <h1>硅谷后台</h1>
                </Link>
                <Menu mode="inline" theme="dark">
                    {this.getMenuNodes(menuList)}
                </Menu>
            </div>
        )
    }
}
