import React, { Component } from 'react'
import { Card , Table , Button , message , Modal} from 'antd';
import {PlusOutlined,ArrowRightOutlined} from '@ant-design/icons';

import LinkButton from '../../components/link-button'
import {reqCategorys,reqAddCategory,reqUpdateCategory} from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'
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
        showStatus : 0,//分类的添加或修改显示状态：0：两者都不显示 1：显示添加分类模块 2：显示修改分类模块
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
              render: (category) => (//返回需要显示的界面标签
                <span>
                    <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                    {this.state.parentId==='0'?<LinkButton onClick={() => {this.showSubCategorys(category)}}>查看子分类</LinkButton>:null}
                </span>
              ),
            }
        ];
    }

    //Table信息获取
    //a:(重点)如果传了a则按传的参数赋值，如果没传则用state里的parentId值
    getCategorys = async (a) => {
        const parentId =  a || this.state.parentId
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

    //响应点击取消：隐藏框
    handleCancel = () => {
        this.setState({showStatus : 0})
    }

    //修改分类ok按钮
    updateCategory = async()=> {
        const {categoryName} = this.formRef.formRef.current.getFieldsValue()
        if(categoryName !== '' && !categoryName.match(/^[ ]*$/)){
            //1、隐藏确定
            this.setState({showStatus : 0})
            //2、发请求更新分类
            const categoryId = this.category._id
            const result = await reqUpdateCategory(categoryId,categoryName)
            if (result.data.status === 0) {
                //3、重新显示列表
                this.getCategorys()
            }
        }
    }

    //添加ok按钮
    addCategory = async()=> {
        const categoryName = this.formRef.refs.formRef.getFieldsValue().inputName
        if(categoryName !== '' && !categoryName.match(/^[ ]*$/)){
            //1、隐藏确定
            this.setState({showStatus : 0})
            //2、发送添加请求
            const parentId = this.formRef.refs.formRef.getFieldsValue().selectName
            const result = await reqAddCategory(parentId,categoryName)
            if (result.data.status === 0) {
                //当前页面和添加的页面相同时更新页面(不然多余一次请求)
                if(parentId === this.state.parentId){//添加页面和所添加项为同一页面时
                    //3、重新显示列表
                    this.getCategorys()
                }else if(parentId === '0'){//当添加页面为二级分类列表，而添加的是一级分类列表时(只更新一级列表)
                    this.getCategorys('0')
                }
            }
        }
    }

    //点击添加按钮
    showAdd = ()=> {
        //显示添加Card
        this.setState({showStatus : 1})

    }

    //点击修改按钮
    showUpdate = (category)=> {
        this.category = category
        this.setState({showStatus : 2})
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
        const {categorys,loading,subCategorys,parentId,parentName,showStatus} = this.state
        //读取指定分类
        const category = this.category || {}
        const title = parentId==='0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={()=>{this.showCategorys()}}>一级分类列表</LinkButton>
                <ArrowRightOutlined style={{marginRight:5}} />
                <span>{parentName}</span>
            </span>
        )
        const extra = (
            <Button type="primary" icon={<PlusOutlined />} onClick={this.showAdd}>
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
                <Modal
                    title="添加分类"
                    visible={showStatus===1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        categorys={categorys}
                        parentId={parentId}
                        ref={(formRef) => {this.formRef = formRef}}
                    />
                </Modal>
                <Modal
                    title="修改分类"
                    visible={showStatus===2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm
                        categoryName={category.name ? category.name : ''}
                        ref={(formRef) => {this.formRef = formRef}}
                    />
                </Modal>
            </div>
        )
    }
}
