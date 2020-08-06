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
        this.formRef.current.setFieldsValue({
            inputName : ''
        });
    }

    render() {
        const {roles} = this.props
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
                    initialValue=''
                    rules={[
                        { required: true, message: '用户名必须输入' }
                    ]}
                >
                    <Input placeholder='请输入用户名' />
                </Item>
                <Item
                    label="密码："
                    name='password'
                    initialValue=''
                    rules={[
                        { required: true, message: '密码必须输入' }
                    ]}
                >
                    <Input type='password' placeholder='请输入密码' />
                </Item>
                <Item
                    label="手机号："
                    name='phone'
                    initialValue=''
                    rules={[
                        { required: true, message: '手机号必须输入' }
                    ]}
                >
                    <Input placeholder='请输入手机号' />
                </Item>
                <Item
                    label="邮箱："
                    name='email'
                    initialValue=''
                    rules={[
                        { required: true, message: '邮箱必须输入' }
                    ]}
                >
                    <Input placeholder='请输入邮箱' />
                </Item>
                <Item
                    label="角色："
                    name='role_id'
                    initialValue=''
                >
                    <Select>
                        {roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)}
                    </Select>
                </Item>
            </Form>
        )
    }
}