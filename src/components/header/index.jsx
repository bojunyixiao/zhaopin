import React, { Component } from 'react'

import {reqWeather} from '../../api'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import './index.less'

/**
 * 头部导航组件
 */
export default class Header extends Component {
    state = {
        currentTime : formateDate(Date.now()),
        dayPictureUrl : '',
        weather : ''
    }

    //定时器，每秒刷新时间
    getTime =()=>{
        setInterval(() => {
            this.setState({currentTime : formateDate(Date.now())})
        }, 1000);
    }

    //天气
    getWeather = async()=>{
        const {dayPictureUrl,weather} = await reqWeather('天津')
        // console.log("const")
        console.log({dayPictureUrl,weather})
        this.setState({dayPictureUrl,weather})
    }

    componentDidMount() {
        //引入每秒更新当前时间方法
        this.getTime()
        //获取当前天气
        this.getWeather()
    }
    

    render() {
        const {currentTime,dayPictureUrl,weather} = this.state
        const username = memoryUtils.user.username
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{username}</span>
                    <a href="">退出</a>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">首页</div>
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
