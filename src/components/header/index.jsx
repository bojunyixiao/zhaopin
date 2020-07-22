import React, { Component } from 'react'
import './index.less'

import memoryUtils from '../../utils/memoryUtils'
/**
 * 头部导航组件
 */
export default class Header extends Component {
    render() {
        return (
            <div className="header">
                Hello {memoryUtils.user.username}
            </div>
        )
    }
}
