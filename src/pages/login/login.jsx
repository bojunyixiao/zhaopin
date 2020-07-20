import React, { Component } from 'react'
import { Form, Input, Button} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './login.less'
import login from './images/logo.png'
import 'antd/dist/antd.less'
// 登录的路由界面
export default class Login extends Component {
    render() {
        const onFinish = values => {
            console.log('Received values of form1: ', values);
          };
        const onFinishFailed = (values, errorFields, outOfDate) => {
            console.log('Received values of form2: ', values);
          };
        return (
            <div className="login">
                <header className="login-header">
                    <img src={login} alt="logo"/>
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        >
                        <Form.Item
                            name="username"
                            rules={[
                                { required: true, whitespace:true, message: '请输入您的用户名！' },
                                { min: 4, message: '用户名至少4位！' },
                                { max: 12, message: '用户名最多12位！' },
                                { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成！' },
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: '请输入您的密码！' },
                                { min: 4, message: '密码至少4位！' },
                                { max: 12, message: '密码最多12位！' },
                                { pattern: /^[a-zA-Z0-9_]+$/, message: '密码必须是英文、数字或下划线组成！' },
                            ]}
                        >
                            <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                            </Button>
                        </Form.Item>
                        </Form>
                </section>
            </div>
        )
    }
}
