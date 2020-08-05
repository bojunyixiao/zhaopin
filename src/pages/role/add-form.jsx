import React, { Component } from 'react'
import {
    Form,
    Input
} from 'antd'

const Item = Form.Item
/**
 * 添加分类的From组件
 */
export default class AddForm extends Component {

    // componentDidUpdate() {
    //     this.refs.formRef.setFieldsValue({
    //         inputName : ''
    //     });
    // }

    render() {
        return (
            <Form ref='formRef'>
                <Item
                    name='inputName'
                    initialValue=''
                    rules={[
                        { required: true, message: '角色名称必须输入' }
                    ]}
                >
                    <Input placeholder='请输入角色名称' />
                </Item>
            </Form>
        )
    }
}