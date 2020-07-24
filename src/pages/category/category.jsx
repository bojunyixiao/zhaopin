import React, { Component } from 'react'
import { Card , Table , Button, message } from 'antd';
import {PlusOutlined,ArrowRightOutlined} from '@ant-design/icons';

import LinkButton from '../../components/link-button'
import {reqCategorys} from '../../api'
/**
 * 商品分类路由
 */
export default class Category extends Component {
    state = {
        loading : false,//是否正在获取数据中
        categorys : [],//一级分类列表
        subCategorys : [],//二级分类列表
        parentId : '0',//当前需要显示的父列表的Id
        parentName : '',//当前需要显示的父列表的Name
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
              render: (categorys) => (//返回需要显示的界面标签
                <span>
                    <LinkButton>修改分类</LinkButton>
                    {this.state.parentId==='0'?<LinkButton onClick={() => {this.showSubCategorys(categorys)}}>查看子分类</LinkButton>:null}
                </span>
              ),
            }
        ];
    }

    //Table信息获取
    getCategorys = async() => {
        const {parentId} =  this.state
        //发送请求前，显示loading
        this.setState({loading:true})
        const result =  await reqCategorys(parentId)
        //发送请求后，隐藏loading
        this.setState({loading:false})
        if(result.data.status === 0){
            const categorys = result.data.data
            if(parentId==='0'){
                //一级分类
                this.setState({categorys})
            }else{
                //二级分类
                this.setState({subCategorys:categorys})
            }
        }else{
            message.error("获取分类列表失败")
        }
    }

    //点击查看子分类，显示子分类内容
    showSubCategorys = (categorys) => {
        this.setState({
            parentId : categorys._id,
            parentName : categorys.name
        },()=>{
            this.getCategorys()
        })
    }

    //点击一级分类回退到一级分类
    showCategorys = () => {
        this.setState({
            parentId : '0',
            parentName : '',
            subCategorys : []
        })
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
        const {categorys,loading,subCategorys,parentId,parentName} = this.state
        const title = parentId==='0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={()=>{this.showCategorys()}}>一级分类列表</LinkButton>
                <ArrowRightOutlined style={{marginRight:5}} />
                <span>{parentName}</span>
            </span>
        )
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
                    dataSource={parentId==='0'?categorys:subCategorys}
                    columns={this.columns}
                    pagination={{defaultPageSize:5,showQuickJumper:true}}
                />
                </Card>
            </div>
        )
    }
}
