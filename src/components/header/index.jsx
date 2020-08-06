import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import { Modal } from 'antd';

import {reqWeather} from '../../api'
import {formateDate} from '../../utils/dateUtils'
import menuList from '../../config/menuConfig/menuConfig'
import storageUtils from '../../utils/storageUtils'
import memoryUtils from '../../utils/memoryUtils'
import './index.less'
import LinkButton from '../link-button';

/**
 * 头部导航组件
 */
class Header extends Component {
    state = {
        currentTime : formateDate(Date.now()),
        dayPictureUrl : '',
        weather : ''
    }

    //定时器，每秒刷新时间
    getTime =()=>{
        this.intervalId = setInterval(() => {
            this.setState({currentTime : formateDate(Date.now())})
        }, 1000);
    }

    //天气
    getWeather = async()=>{
        const {dayPictureUrl,weather} = await reqWeather('河北区')
        this.setState({dayPictureUrl,weather})
    }

    //获取title
    getTitle = ()=>{
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if(item.key===path){
                title = item.title
            }else if(item.children){
                const cItem = item.children.find(cItem=>cItem.key===path)
                if(cItem){
                    title = cItem.title
                }
            }
        })
        return title
    }

    //退出登录
    logout = () => {
        Modal.confirm({
            // icon: <ExclamationCircleOutlined />,
            content: '确定退出吗？',
            onOk: () => {
                //删除保存的user数据
                storageUtils.removeUser()
                memoryUtils.user = {}
                //跳转到login页面
                this.props.history.replace('/login')
            }
        });
    }
    /**
     * 完成第一次render后调用
     */
    componentDidMount() {
        //引入每秒更新当前时间方法
        this.getTime()
        //获取当前天气
        this.getWeather()
    }
    
    /**
     * 当前组件卸载之前调用
     */
    componentWillUnmount(){
        //清除定时器
        clearInterval(this.intervalId)
    }

    render() {
        const {currentTime,dayPictureUrl,weather} = this.state
        const username = memoryUtils.user.username
        //取出title
        const title = this.getTitle()
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather"/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)
