import React, { PureComponent } from 'react'
import {
    Form,
    Input,
    Select
} from 'antd'

const Item = Form.Item
const Option = Select.Option
/**
 * 添加/修改用户的From组件
 */
export default class UserForm extends PureComponent {
    constructor(props){
        super(props)
        //创建用来保存ref标识的标签对象容器
        this.formRef = React.createRef()
    }

    //render后把input中的值去除
    componentDidUpdate() {
        const user = this.props.user || {}
        this.formRef.current.setFieldsValue({
            username : user.username,
            password : user.password,
            phone : user.phone,
            email : user.email,
            role_id : user.role_id
        });
    }

    render() {
        const {roles} = this.props
        const user = this.props.user || {}
        const layout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 16 },
        };
        return (
            <Form
                ref={this.formRef}
                {...layout}
            >
                <Item
                    label="用户名："
                    name='username'
                    initialValue={user.username}
                    rules={[
                        { required: true, message: '用户名必须输入' },
                        { min: 4, message: '用户名至少4位！' },
                        { max: 12, message: '用户名最多12位！' },
                        { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成！' },
                    ]}
                >
                    <Input placeholder='请输入用户名' />
                </Item>
                {user._id ? null : (
                    <Item
                        label="密码："
                        name='password'
                        initialValue={user.password}
                        rules={[
                            { required: true, message: '密码必须输入' },
                            { min: 4, message: '密码至少4位！' },
                            { max: 12, message: '密码最多12位！' },
                            { pattern: /^[a-zA-Z0-9_]+$/, message: '密码必须是英文、数字或下划线组成！' },
                        ]}
                    >
                        <Input type='password' placeholder='请输入密码' />
                    </Item>
                )}
                <Item
                    label="手机号："
                    name='phone'
                    initialValue={user.phone}
                    rules={[
                        { required: true, message: '手机号必须输入' }
                    ]}
                >
                    <Input placeholder='请输入手机号' />
                </Item>
                <Item
                    label="邮箱："
                    name='email'
                    initialValue={user.email}
                    rules={[
                        { required: true, message: '邮箱必须输入' }
                    ]}
                >
                    <Input placeholder='请输入邮箱' />
                </Item>
                <Item
                    label="角色："
                    name='role_id'
                    initialValue={user.role_id}
                >
                    <Select>
                        {roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)}
                    </Select>
                </Item>
            </Form>
        )
    }
}