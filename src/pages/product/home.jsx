import React, { Component } from 'react'
import {Card,Select,Input,Button,Table} from 'antd'
import {PlusOutlined} from '@ant-design/icons'

import LinkButton from '../../components/link-button'
import {reqProducts,reqSearchProducts} from '../../api'
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

    //获取指定页码的列表数据显示
    getProducts = async(pageNum) => {
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
            <Button type="primary" icon={<PlusOutlined />} onClick={this.showAdd}>
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
