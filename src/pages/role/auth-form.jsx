import React, { Component } from 'react'
import {
    Form,
    Input,
    Tree
} from 'antd'

import menuList from '../../config/menuConfig/menuConfig'

const Item = Form.Item
/**
 * 添加分类的From组件
 */
export default class AuthForm extends Component {
    constructor (props){
        super(props)
        //根据传入的munus生成初始状态
        const checkedKeys = this.props.authRole.menus
        this.state = {
            checkedKeys
        }
    }

    //为父组件提交最新menus数据的方法
    getMenus = () => this.state.checkedKeys

    getTreeData = () => {
        const data = [
            {
              title: '平台权限',
              key: '0-0',
              children: menuList
            },
          ]
        return data
    }

    //props改变时启用
    componentWillReceiveProps(nextProps) {
        const checkedKeys = nextProps.authRole.menus
        this.setState({checkedKeys})
    }
    

    componentWillMount() {
        this.treeData = this.getTreeData()
    }

    render() {
        const {name} = this.props.authRole
        const {checkedKeys} = this.state

        //点击复选框更新所选状态checkedKeys
        const onCheck = (checkedKeys, info) => {
            this.setState({checkedKeys})
          };
        return (
            <Form ref='formRef'>
                <Item label="角色名称">
                    <Input value={name} disabled />
                </Item>
                <Tree
                    checkable
                    defaultExpandAll = {true}//默认展开全部节点
                    treeData={this.treeData}//树 数据
                    checkedKeys={checkedKeys}//默认选中复选框
                    onCheck={onCheck}//点击复选框触发
                />
            </Form>
        )
    }
}