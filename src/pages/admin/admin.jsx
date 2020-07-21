import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import memoryUtils from '../../utils/memoryUtils'

// 后台管理的路由组件
export default class Admin extends Component {
    render() {
        return (
            <div>
                Hello {memoryUtils.user.username}
            </div>
        )
    }
}
