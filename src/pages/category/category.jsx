import React, { Component } from 'react'
import { Card , Table , Button, message } from 'antd';
import {PlusOutlined} from '@ant-design/icons';

import LinkButton from '../../components/link-button'
import {reqCategorys} from '../../api'
/**
 * 商品分类路由
 */
export default class Category extends Component {
    state = {
        categorys : [],
        loading : false
    }

    //初始化Table标题
    initColumns = () => {
        this.columns = [
            {
              title: '分类的名称',
              dataIndex: 'name',//显示数据的对应属性名
            },
            {
              title: '操作',
              width:300,
              render: () => (//返回需要显示的界面标签
                <span>
                    <LinkButton>修改分类</LinkButton>
                    <LinkButton>查看子分类</LinkButton>
                </span>
              ),
            }
        ];
    }

    //Table信息获取
    getCategorys = async() => {
        //发送请求前，显示loading
        this.setState({loading:true})
        const result =  await reqCategorys('0')
        //发送请求后，隐藏loading
        this.setState({loading:false})
        if(result.data.status === 0){
            const categorys = result.data.data
            this.setState({categorys})
        }else{
            message.error("获取分类列表失败")
        }
    }

    //为第一次render准备数据
    componentWillMount() {
        this.initColumns()
    }

    //第一次render后执行异步
    componentDidMount() {
        this.getCategorys()
    }
    

    render() {
        //Card的左侧标题
        const title = '一级分类列表'
        const {categorys,loading} = this.state
        const extra = (
            <Button type="primary" icon={<PlusOutlined />}>
                添加
            </Button>
        )
        return (
            <div>
                <Card title={title} extra={extra} >
                    <Table
                    bordered
                    rowKey='_id'
                    loading={loading}
                    dataSource={categorys}
                    columns={this.columns}
                    pagination={{defaultPageSize:5,showQuickJumper:true}}
                />
                </Card>
            </div>
        )
    }
}
