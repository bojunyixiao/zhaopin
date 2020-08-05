import React, { Component } from 'react'
import { Card , Button , Table , message , Modal} from 'antd'

import {PAGE_SIZE} from "../../utils/constants"
import {reqRoles} from '../../api'
import AddForm from './add-form'

/**
 * 角色路由
 */

export default class Role extends Component {
    state={
        roles:[],//所有角色的列表
        role:{},//选中的role
        isShowAdd:false, //是否显示添加界面
    }

    initColumn = () => {
        this.columns = [
            {
                title:'角色名称',
                dataIndex:'name'
            },
            {
                title:'创建时间',
                dataIndex:'create_time'
            },
            {
                title:'授权时间',
                dataIndex:'auth_time'
            },
            {
                title:'授权人',
                dataIndex:'auth_name'
            },
        ]
    }

    getRoles = async() => {
        const result = await reqRoles()
        if(result.data.status === 0){
            const roles = result.data.data
            this.setState({roles})
        }else{
            message.error("获取角色列表失败")
        }
    }

    onRow = (role)=> {
        return {
            onClick: event => {// 点击行
                console.log("role onclick",role)
                this.setState({role})
            }, 
        }
    }

    /**
     * 添加角色，点击ok
     */
    addRole = () => {//点击ok
        this.setState({isShowAdd:false})
    }
    addRoles = () => {//点击ok
        this.setState({isShowAdd:true})
    }

    /**
     * 添加角色，点击Cancel
     */
    handleCancel = () => {//点击Cancel
        this.setState({isShowAdd:false})
    }

    componentWillMount() {
        this.initColumn()
    }
    
    componentDidMount() {
        this.getRoles()
    }
    
    
    render() {
        const {roles,role,isShowAdd} = this.state
        const title = (
            <span>
                <Button type="primary" onClick={() => this.addRoles(this)}>创建角色</Button>
                <Button type="primary" disabled={!role._id} style={{marginLeft:'15px'}}>设置角色权限</Button>
            </span>
        )
        return (
            <div>
                <Card title={title}>
                    <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{defaultPageSize:PAGE_SIZE}}
                    rowSelection={{type:'radio',selectedRowKeys:[role._id]}}
                    onRow={this.onRow}
                    />;
                </Card>
                <Modal
                    title="添加分类"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        ref={(formRef) => {this.formRef = formRef}}
                    />
                </Modal>
            </div>
        )
    }
}
