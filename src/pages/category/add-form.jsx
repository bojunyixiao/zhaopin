import React, { Component } from 'react'
import {
    Form,
    Select,
    Input
} from 'antd'

const Item = Form.Item
const Option = Select.Option
/**
 * 添加分类的From组件
 */
export default class AddForm extends Component {

    componentDidUpdate() {
        this.refs.formRef.setFieldsValue({
            selectName : this.props.parentId,
            inputName : ''
        });
    }

    render() {
        const {categorys,parentId} = this.props
        return (
            <Form ref='formRef'>
                <Item name='selectName' initialValue={parentId} >
                    <Select>
                        <Option value='0'>一级分类</Option>
                        {categorys.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>)}
                    </Select>
                </Item>
                <Item
                    name='inputName'
                    initialValue=''
                    rules={[
                        { required: true, message: '分类名称必须输入' }
                    ]}
                >
                    <Input placeholder='请输入分类名称' />
                </Item>
            </Form>
        )
    }
}