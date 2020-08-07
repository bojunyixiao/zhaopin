import React, { Component } from 'react'
import { Redirect,Route,Switch} from 'react-router-dom'
import { Layout } from 'antd';

import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home/home'
import Category from '../category/category'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import NotFound from '../not-found/not-found'

const {Footer, Sider, Content } = Layout;

// 后台管理的路由组件
export default class Admin extends Component {
    render() {
        // 如果内存中没有user ==> 当前没有登录
        const user = memoryUtils.user
        if(!user || !user._id){
            //自动跳转到登录
            return <Redirect  to='/login' />
        }
        return (
            <Layout style={{minHeight:'100%'}}>
                <Sider>
                    <LeftNav />
                </Sider>
                <Layout>
                    <Header></Header>
                    <Content style={{margin:20,backgroundColor:'white'}}>
                        <Switch>
                            <Redirect exact={true} from='/' to='/home'/>
                            <Route path='/home' component={Home}/>
                            <Route path='/category' component={Category}/>
                            <Route path='/product' component={Product}/>
                            <Route path='/role' component={Role}/>
                            <Route path='/user' component={User}/>
                            <Route path='/charts/bar' component={Bar}/>
                            <Route path='/charts/line' component={Line}/>
                            <Route path='/charts/pie' component={Pie}/>
                            <Route component={NotFound}/>{/*上面没有一个匹配的，直接显示 */}
                        </Switch>
                    </Content>
                    <Footer style={{textAlign:'center',color:'#cccccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                </Layout>
            </Layout>
        )
    }
}
