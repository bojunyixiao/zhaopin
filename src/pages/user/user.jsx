import React, { Component } from 'react'
import {Card,Button,Table,Modal, message} from 'antd'

import {PAGE_SIZE} from "../../utils/constants"
import {formateDate} from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'
import {reqUsers,reqDeleteUsers,reqAddOrUpdateUsers} from '../../api'
import UserForm from './user-form'
/**
 * 用户路由
 */
export default class User extends Component {
    state = {
        users:[],//所有用户的列表
        roles:[],//所有角色的列表
        isShow:0,//控制Modal 0：都不显示 1：显示添加 2：显示修改
    }
    constructor(props){
        super(props)
        //创建用来保存ref标识的标签对象容器
        this.userForm = React.createRef()
    }
    //表格的抬头
    initColumns = () => {
        this.columns = [
            {
                title:'用户名',
                dataIndex:'username'
            },
            {
                title:'邮箱',
                dataIndex:'email',
            },
            {
                title:'电话',
                dataIndex:'phone',
            },
            {
                title:'注册时间',
                dataIndex:'create_time',
                render:formateDate //简单的写，因为render会传值dataIndex
            },
            {
                title:'所属角色',
                dataIndex:'role_id',
                // render:(role_id) => this.state.roles.find(role => role._id===role_id).name
                render:(role_id) => this.roleNames[role_id] //生成一个数组，属性名为role_id，值为角色名字，一次到位，以防以后用到，便可直接用了
            },
            {
                title:'操作',
                render:(user)=>(
                    <span>
                        <LinkButton onClick={() => {this.updateUser(user)}}>修改</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
            }
        ]
    }

    //表格的内容
    getUsers = async () => {
        const result = await reqUsers()
        if(result.data.status===0){
            const {users,roles} = result.data.data
            this.initRoleNames(roles)
            this.setState({users,roles})
        }else{
            message.error("获取用户列表失败")
        }
    }

    //形成roleNames数组（很厉害的方法思路）
    initRoleNames = (roles) => {//pre:前几次的结果，role：下一个进来的roles值，{}：初始值
        const roleNames = roles.reduce((pre,role) => {//对象形成的办法pre[]
            pre[role._id] = role.name
            return pre
        },{})
        //保存
        this.roleNames = roleNames
    }

    //点击修改按钮
    updateUser = () => {
        this.setState({isShow:2})
    }

    //点击删除按钮
    deleteUser = (user) => {
        console.log('user:',user)
        Modal.confirm({
            content: '确认删除'+user.username+'吗？',
            onOk: async () => {
                const result = await reqDeleteUsers(user._id)
                if(result.data.status===0){
                    message.success("删除用户成功")
                    //刷新页面
                    this.getUsers()
                }else{
                    message.error("删除用户失败")
                }
            }
        });
    }

    //添加/更新用户
    addOrUpdateUser = async () => {
        //隐藏modal
        this.setState({isShow:0})
        //1、收集输入数据
        const user = this.userForm.current.formRef.current.getFieldsValue()
        console.log('user:',user)
        //2、提交添加请求
        const result = await reqAddOrUpdateUsers(user)
        //3、更新列表显示
        if(result.data.status===0){
            message.success("用户添加成功")
            //刷新页面
            this.getUsers()
        }else{
            message.error("用户添加失败")
        }
    }

    componentWillMount() {
        this.initColumns()
    }
    
    componentDidMount() {
        this.getUsers()
    }
    
    render() {
        const {users,isShow,roles} = this.state
        const title = (
            <Button type='primary' onClick={() => this.setState({isShow:1})}>创建用户</Button>
        )
        return (
            <div>
                <Card title={title}>
                    <Table
                        bordered
                        rowKey='_id'
                        dataSource={users}//表内容
                        columns={this.columns}//表抬头
                        pagination={{defaultPageSize:PAGE_SIZE}}//每页的数量
                    />
                </Card>
                <Modal
                    title="添加用户"
                    visible={isShow===1}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        this.setState({isShow:0})
                    }}
                >
                    <UserForm ref={this.userForm} roles={roles} />
                </Modal>
                <Modal
                    title="修改用户"
                    visible={isShow===2}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        this.setState({isShow:0})
                    }}
                >
                    <div>修改页面</div>
                </Modal>
            </div>
        )
    }
}
