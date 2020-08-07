import React, { Component } from 'react'
import { Card , Button , Table , message , Modal} from 'antd'

import {PAGE_SIZE} from "../../utils/constants"
import {reqRoles} from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import {reqAddRole , reqUpdataRole} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {formateDate} from '../../utils/dateUtils'

/**
 * 角色路由
 */

export default class Role extends Component {
    state={
        roles:[],//所有角色的列表
        role:{},//选中的role
        isShowAdd:false, //是否显示添加界面
        isShowAuth:false,//是否显示权限界面
    }

    initColumn = () => {
        this.columns = [
            {
                title:'角色名称',
                dataIndex:'name'
            },
            {
                title:'创建时间',
                dataIndex:'create_time',
                render:(create_time) => formateDate(create_time)//复杂的写，与下面的授权时间对比
            },
            {
                title:'授权时间',
                dataIndex:'auth_time',
                render:formateDate //简单的写，因为render会传值dataIndex
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
                this.authRole = role
                this.setState({role})
                // console.log('click onRow',role)
            }, 
        }
    }

    /**
     * 添加角色，点击ok
     */
    addRole = async () => {//点击ok
        // const roleName = this.formRef.refs.formRef.getFieldsValue().inputName
        const roleName = this.refs.addForm.refs.formRef.getFieldsValue().inputName
        if(roleName !== ''){
            //隐藏确定
            this.setState({isShowAdd:false})
            const result = await reqAddRole(roleName)
            if(result.data.status === 0){
                this.getRoles()
            }
        }
    }

    /**
     * 添加权限角色，点击ok
     */
    updataRole = async () => {
        //隐藏确认框
        this.setState({isShowAuth:false})

        const {role} = this.state
        //得到最新的menus
        const menus = this.refs.authForm.getMenus()
        role.menus = menus
        role.auth_name = memoryUtils.user.username
        role.auth_time = Date.now()
        //请求更新
        const result = await reqUpdataRole(role)
        if(result.data.status === 0){
            //如果当前更新的是自己角色的权限，强制退出
            if(role._id===memoryUtils.user.role_id){
                //删除保存的user数据
                storageUtils.removeUser()
                memoryUtils.user = {}
                //跳转到login页面
                this.props.history.replace('/login')
                message.warning("当前用户角色权限修改了，请重新登录")
            }else{
                message.success("角色权限设置成功")
                this.setState({roles:[...this.state.roles]})//神方法：如果role改变了，roles的那一项也改变了，直接[...]就可
            }
        }
    }

    //点击设置权限角色 按钮
    authRoles = () => {
        this.setState({isShowAuth:true})
    }
    //点击创建角色
    addRoles = () => {//点击ok
        this.setState({isShowAdd:true})
    }

    componentWillMount() {
        this.initColumn()
    }
    
    componentDidMount() {
        this.getRoles()
    }
    
    
    render() {
        const {roles,role,isShowAdd,isShowAuth} = this.state
        const {authRole} =  this
        const title = (
            <span>
                <Button type="primary" onClick={() => this.addRoles(this)}>创建角色</Button>
                <Button type="primary" disabled={!role._id} style={{marginLeft:'15px'}} onClick={() => this.authRoles(this)}>设置角色权限</Button>
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
                    rowSelection={{
                        type:'radio',
                        selectedRowKeys:[role._id],
                        onSelect:(role) => {
                            this.setState({role})//解决点击checkbox不响应问题
                        }
                    }}//selectedRowKeys指定选中项的 key 数组
                    onRow={this.onRow}
                    />
                </Card>
                <Modal
                    title="添加分类"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => {
                        this.setState({isShowAdd:false})
                    }}
                >
                    <AddForm
                        // ref={(formRef) => {this.formRef = formRef}}
                        ref = 'addForm'
                    />
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updataRole}
                    onCancel={() => {
                        this.setState({isShowAuth : false})
                    }}
                >
                    <AuthForm
                        authRole = {authRole}
                        ref = 'authForm'
                    />
                </Modal>
            </div>
        )
    }
}