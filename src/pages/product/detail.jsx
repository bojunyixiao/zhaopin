import React, { Component } from 'react'
import {Card,List,} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'

import LinkButton from '../../components/link-button'

const Item = List.Item

export default class ProductDetail extends Component {
    render() {
        //读取携带过来的state数据
        const {name,desc,price,detail,imgs} = this.props.location.state.product

        const title = (
            <span>
                <LinkButton>
                    <ArrowLeftOutlined
                        style={{marginRight:10,fontSize:20}}
                        onClick={() => this.props.history.goBack()}
                    />
                </LinkButton>
                <span>商品详情</span>
            </span>
        )
        return (
            <Card title={title} className="product-detail">
                <List>
                    <Item>
                        <span>
                            <span className="left">商品名称：</span>
                            <span>{name}</span>
                        </span>
                    </Item>
                    <Item>
                        <span>
                            <span className="left">商品描述：</span>
                            <span>{desc}</span>
                        </span>
                    </Item>
                    <Item>
                        <span>
                            <span className="left">商品价格：</span>
                            <span>￥{price}</span>
                        </span>
                    </Item>
                    <Item>
                        <span>
                            <span className="left">所属分类：</span>
                            <span>电脑 --> 笔记本</span>
                        </span>
                    </Item>
                    <Item>
                        <span>
                            <span className="left">商品图片：</span>
                            <span>
                                {imgs.map(img => (
                                    <img
                                        key={img}
                                        className="product-img"
                                        src={img} alt="img"
                                    />
                                ))}
                            </span>
                        </span>
                    </Item>
                    <Item>
                        <span>
                            <span className="left">商品详情：</span>
                            <span dangerouslySetInnerHTML={{__html:detail}}>
                            </span>
                        </span>
                    </Item>
                </List>
            </Card>
        )
    }
}
