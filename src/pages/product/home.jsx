import React, { Component } from 'react'
import {Card,Select,Input,Button,Table, message} from 'antd'
import {PlusOutlined} from '@ant-design/icons'

import LinkButton from '../../components/link-button'
import {reqProducts,reqSearchProducts,reqUpdateStatus} from '../../api'
import {PAGE_SIZE} from '../../utils/constants'

const Option = Select.Option

export default class ProductHome extends Component {
    state={
        total:0,
        products:[],//初始的表内值
        loading:false,//是否正在加载中
        searchContent:'',//搜索的关键字
        searchType:'productName'//根据哪个字段搜索
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
              // dataIndex: 'status',
              render:(product) => {
                const {status,_id} = product
                const newStatus = status===1?2:1
                  return (
                      <span>
                          <Button type='primary' onClick={() => this.updateStatus(_id,newStatus)}>{status===1?'下架':'上架'}</Button>
                          <span>{status===1?'在售':'已下架'}</span>
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
                        {/* 将product对象使用的state传递给目标路由组件 */}
                          <LinkButton onClick={() => this.props.history.push('/product/detail',{product})}>详情</LinkButton>
                          <LinkButton onClick={() => this.props.history.push('/product/addupdate',product)}>修改</LinkButton>
                      </span>
                  )
              }
            },
        ];
    }

    /**
     * 更新商品的状态
     */
    updateStatus = async(productId,status) => {
      const result = await reqUpdateStatus(productId,status)
      if(result.data.status === 0){
        message.success("更新商品成功")
        this.getProducts(this.pageNum)
      }
    }

    //获取指定页码的列表数据显示
    getProducts = async(pageNum) => {
      this.pageNum = pageNum //保存pageNum，让其上下架刷新页面时能回到对应页面
      this.setState({loading:true})//显示loading
      const {searchContent,searchType} = this.state
      let result
      //如果searchContent有值，则搜索分类。没有值，则展现表单
      if(searchContent){
        result = await reqSearchProducts(pageNum,PAGE_SIZE,searchContent,searchType)
      }else{
        result = await reqProducts(pageNum,PAGE_SIZE)
      }

      this.setState({loading:false})//隐藏loading
      if(result.data.status === 0){
        //取出分页数据，更新状态
        const {total,list} = result.data.data
        this.setState({
          total,
          products:list
        })
      }
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount(){
      this.getProducts(1)
    }
    
    render() {
        const {total,products,loading,searchContent,searchType} = this.state
        //Card左侧
        const title = (
            <span>
                <Select
                  value={searchType}
                  style={{width:150}}
                  onChange={value => this.setState({searchType:value})}
                >
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Input
                  placeholder="关键字"
                  style={{width:150,margin:'0 15px'}}
                  value={searchContent}
                  onChange={event => this.setState({searchContent:event.target.value})}
                />
                <Button type="primary" onClick={() => this.getProducts(1)}>搜索</Button>
            </span>
        )
        //Card右侧
        const extra = (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => this.props.history.push('/product/addupdate')}>
                添加商品
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                bordered
                loading={loading}
                rowKey='_id'
                dataSource={products}
                columns={this.columns}
                pagination={{
                  current:this.pageNum,
                  total,//总数，设置其可以出现分页
                  defaultPageSize:PAGE_SIZE,//每一页的参数数量
                  showQuickJumper:true,//跳转页面
                  onChange:this.getProducts//想等于(pageNum)=>{this.getProducts(pageNum)} 因实参就是我想接受的参数
                }}
                />;
            </Card>
        )
    }
}
