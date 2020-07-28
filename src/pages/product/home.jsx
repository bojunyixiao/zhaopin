import React, { Component } from 'react'
import {Card,Select,Input,Button,Table} from 'antd'
import {PlusOutlined} from '@ant-design/icons'


import LinkButton from '../../components/link-button'

const Option = Select.Option

export default class ProductHome extends Component {
    state={
        products:[
            {
              "status": 1,
              "imgs": [
                ""
              ],
              "_id": "5f1fc63d379ac30bcc806769",
              "pCategoryId": "1",
              "categoryId": "1",
              "name": "电脑",
              "desc": "很好看的电脑很好看的电脑很好看的电脑很好看的电脑很好看的电脑很好看的电脑很好看的电脑很好看的电脑",
              "price": 4500,
              "detail": "",
              "__v": 0
            },
            {
              "status": 1,
              "imgs": [
                ""
              ],
              "_id": "5f1fc64c379ac30bcc80676a",
              "pCategoryId": "2",
              "categoryId": "2",
              "name": "电脑2",
              "desc": "很好看的电脑2",
              "price": 5000,
              "detail": "",
              "__v": 0
            }
          ]//初始的表内值
    }

    initColumns = () => {
        this.columns = [
            {
              title: '商品名称',
              dataIndex: 'name',
            },
            {
              title: '商品描述',
              dataIndex: 'desc',
            },
            {
              title: '价格',
              dataIndex: 'price',
              render:(price) => '￥' + price
            },
            {
              width:100,
              title: '状态',
              dataIndex: 'status',
              render:(status) => {
                  return (
                      <span>
                          <Button type='primary'>下架</Button>
                          <span>在售</span>
                      </span>
                  )
              }
            },
            {
              width:100,
              title: '操作',
              render:(product) => {
                  return (
                      <span>
                          <LinkButton>详情</LinkButton>
                          <LinkButton>修改</LinkButton>
                      </span>
                  )
              }
            },
        ];
    }

    componentWillMount() {
        this.initColumns()
    }
    
    render() {
        const {products} = this.state
        //Card左侧
        const title = (
            <span>
                <Select value="1" style={{width:150}}>
                    <Option value="1">按名称搜索</Option>
                    <Option value="2">按描述搜索</Option>
                </Select>
                <Input placeholder="关键字" style={{width:150,margin:'0 15px'}} />
                <Button type="primary">搜索</Button>
            </span>
        )
        //Card右侧
        const extra = (
            <Button type="primary" icon={<PlusOutlined />} onClick={this.showAdd}>
                添加商品
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                bordered
                rowKey='_id'
                dataSource={products}
                columns={this.columns}
                />;
            </Card>
        )
    }
}
