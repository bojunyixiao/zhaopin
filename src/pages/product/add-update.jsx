import React, { Component } from 'react'
import {Card,Form,Input,Button,Cascader} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'

import LinkButton from '../../components/link-button'
import {reqCategorys} from '../../api'

const {Item} = Form
const { TextArea } = Input;

export default class ProductAddUpdate extends Component {
        state = {
          options:[]
        };
        
        initOption = (categorys) => {
            //根据categorys数据生成options数组
            const options = categorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: false,
            }))

            //更新options状态
            this.setState({options})
        }

        //异步获取一二级分类列表，并显示
        getCategorys = async(parentId) => {
            const result = await reqCategorys(parentId)
            if(result.data.status === 0){
                const categorys = result.data.data
                //如果是一级分类列表
                if(parentId === 0){
                    this.initOption(categorys)
                }else{//二级列表
                    return categorys //返回二级列表 ===> 当前async函数返回的promise就会成功，且value值为categorys
                }
            }
        }

        /**
         * 使用加载下一级列表的回调函数
         */
        loadData = async selectedOptions => {
            //得到选择的option对象
          const targetOption = selectedOptions[0];
            //显示loading
          targetOption.loading = true
            //根据选中的分类，请求获取二级分类列表
            const subCategorys = await this.getCategorys(targetOption.value)
            //隐藏loading
            targetOption.loading = false
            //二级分类数组有数据
            if(subCategorys && subCategorys.length>0){
                const childOption = subCategorys.map(c => ({
                    value: c._id,
                    label: c.name,
                    isLeaf: true,
                }))
                //关联到当前option上
                targetOption.children = childOption
            }else{ //当前选中的分类没有二级分类
                targetOption.isLeaf = true
            }
            //更新options状态
            this.setState({
                options:[...this.state.options]
            })
        };

    /**
     * 验证价格的自定义函数
     */
    validatorPrice = async (rule, value) => {
        if(value*1 <= 0){
            throw new Error('商品价格必须大于0!');
        }
    }

    componentDidMount() {
        this.getCategorys(0)
    }

    componentWillMount() {
        //取出携带的state
        const product = this.props.location.state
        //保存是否是更新的标识
        this.isUpdate = !!product
        this.product =product || {}

    }
    
    
    render() {
        const {isUpdate,product} = this

        const onFinish = values => {
            console.log('Success:', values);
        }

        const layout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 },
          };

        const title = (
            <span>
                <LinkButton>
                    <ArrowLeftOutlined
                        style={{marginRight:10,fontSize:20}}
                        onClick={() => this.props.history.goBack()}
                    />
                </LinkButton>
                <span>{isUpdate?'修改商品':'添加商品'} </span>
            </span>
        )
        return (
            <Card title={title}>
                <Form
                    {...layout}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Item
                        label="商品名称"
                        rules={[{ required: true, message: '必须输入商品名称' }]}
                        name="productName"
                        initialValue={product.name}
                    >
                        <Input placeholder="请输入商品名称" />
                    </Item>
                    <Item
                        label="商品描述"
                        rules={[{ required: true, message: '必须输入商品描述' }]}
                        name="productDesc"
                        initialValue={product.desc}
                    >
                        <TextArea placeholder="请输入商品描述" autoSize={{ minRows: 2, maxRows: 6 }}
                        />
                    </Item>
                    <Item
                        label="商品价格"
                        rules={[
                            { required: true, message: '必须输入商品价格' },
                            { validator:this.validatorPrice }
                        ]}
                        name="productPrice"
                        initialValue={product.price}
                    >
                        <Input type="number" addonAfter="元" placeholder="请输入商品价格" />
                    </Item>
                    <Item label="商品分类" name="productType">
                        <Cascader
                            options={this.state.options}
                            loadData={this.loadData}
                        />
                    </Item>
                    <Item label="商品图片">
                        <div>商品图片</div>
                    </Item>
                    <Item label="商品详情">
                        <div>商品详情</div>
                    </Item>
                    <Item>
                        <Button type="primary" htmlType="submit">提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}
