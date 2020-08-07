import React, { Component } from 'react'
import {Card,Form,Input,Button,Cascader, message} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'

import LinkButton from '../../components/link-button'
import {reqCategorys,reqAddOrUpdateProduct} from '../../api'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'

const {Item} = Form
const { TextArea } = Input;

export default class ProductAddUpdate extends Component {
        state = {
          options:[]
        };
        
        constructor (props){
            super(props)
            //创建用来保存ref标识的标签对象容器
            this.pw = React.createRef()
            this.editor = React.createRef()
        }

        initOption = async(categorys) => {
            //根据categorys数据生成options数组
            const options = categorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: false,
            }))

            //如果是一个二级分类商品的更新
            const {isUpdate,product} = this
            const {pCategoryId} = product
            if(isUpdate && pCategoryId !== '0'){
                //获取对应的二级分类列表
                const subCategorys = await this.getCategorys(pCategoryId)
                //生成二级下拉列表的options
                const childOptions = subCategorys.map(c => ({
                    value: c._id,
                    label: c.name,
                    isLeaf: true,
                }))

                //找到当前商品对应的一级option对象
                const targetOption = options.find(option => option.value === pCategoryId)
                console.log(targetOption)
                //关联对应的一级option上
                targetOption.children = childOptions
            }

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

        const {pCategoryId,categoryId,imgs,detail} = product
        //用来接收级联分类ID的数组
        const categoryIds = []
        if(isUpdate){
            //商品是一个一级分类商品
            if(pCategoryId === 0){
                categoryIds.push(categoryId)
            }else{
                //商品是一个二级分类的商品
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }


        const onFinish = async values => {
            //1、收集数据，并封装成product对象
            const {productName,productDesc,productPrice,productType} = values
            let pCategoryId , categoryId
            console.log('values:',values)
            if(productType.length===1){
                pCategoryId = '0'
                categoryId = productType[0]
            }else{
                pCategoryId = productType[0]
                categoryId = productType[1]
            }
            const imgs = this.pw.current.getImgs()
            const detail = this.editor.current.getDetail()

            const product = {name:productName,desc:productDesc,price:productPrice,imgs,detail,pCategoryId,categoryId}
            //如果是更新，需要添加_id
            if(this.isUpdate){
                product._id = this.product._id
            }
            //2、调用接口请求函数去添加/更新
            const result = await reqAddOrUpdateProduct(product)
            //3、根据结果提示
            const messageAddOrUpdate = this.isUpdate?'修改':'添加'
            if(result.data.status === 0){
                message.success(messageAddOrUpdate+'商品成功！')
                this.props.history.goBack()
            }else{
                message.error(messageAddOrUpdate+ '商品失败！')
            }
        }

        const layout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
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
                    <Item label="商品分类" name="productType" initialValue={categoryIds}>
                        <Cascader
                            options={this.state.options}
                            loadData={this.loadData}
                        />
                    </Item>
                    <Item label="商品图片">
                        <PicturesWall ref={this.pw} imgs={imgs} />
                    </Item>
                    <Item label="商品详情" labelCol={{span: 2}} wrapperCol={{span: 20}}>
                        <RichTextEditor ref={this.editor} detail={detail} />
                    </Item>
                    <Item>
                        <Button type="primary" htmlType="submit">提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}
