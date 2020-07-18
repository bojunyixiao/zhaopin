// 应用的根组件

import React, { Component } from 'react'
import { Button } from 'antd';

export default class App extends Component {
  render() {
    return (
      <div>
        <Button type="primary">Dashed Button</Button>
      </div>
    )
  }
}
