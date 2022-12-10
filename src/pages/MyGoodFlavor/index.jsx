import React, { Component } from 'react'
import { Button, Modal, Form, Input } from 'antd';
import { Table, Tag, Space, DatePicker, Radio } from 'antd';
import { UserOutlined } from "@ant-design/icons";
import axios from 'axios';
import dayjs from 'dayjs';

const { Column, ColumnGroup } = Table;

export default class MyGoodFlavor extends Component {
    state = {
        GoodFlavorData: [
            //test data
            {
                key: '1',
                firstName: 'John',
                lastName: 'Brown',
                age: 32,
                address: 'New York No. 1 Lake Park',
                tags: ['nice', 'developer'],
            },
            {
                key: '2',
                firstName: 'Jim',
                lastName: 'Green',
                age: 42,
                address: 'London No. 1 Lake Park',
                tags: ['loser'],
            },
        ],
        open: false,
        modalState: {
            userid: '',
            flavorType: '',
            theme: '',
            description: '',
            maxprice: 1,
            searchCreateTime: new Date().toISOString(),
            searchChangeTime: new Date().toISOString(),
            searchEndTime: new Date().toISOString(),
            searchState: -1,
            picture: ''
        }
    }

    form = React.createRef()

    addMyGoodFlavor = () => {
        const open = this.state.open
        this.setState({ open: true })
    }

    checkMyGoodFlavor = () => {

    }

    handleOk = () => {
        console.log(this.form.current.getFieldsValue())
        this.setState({ open: false })
    }

    handleCancel = () => {
        this.setState({ open: false })
    }
    render() {
        const open = this.state.open
        const {
            userid,
            flavorType,
            theme,
            description,
            maxprice,
            searchCreateTime,
            searchChangeTime,
            searchEndTime,
            searchState,
            picture
        } = this.state.modalState
        console.log(searchCreateTime)
        return (
            <>
                <Button onClick={this.addMyGoodFlavor}>
                    添加我的寻味道
                </Button>
                <Table dataSource={this.state.MyGoodFlavor}>
                    <Column title="发布用户" dataIndex="userid" key="userid" />
                    <Column title="寻味道主题" dataIndex="theme" key="theme" />
                    <Column
                        title="味道类型"
                        dataIndex="tags"
                        key="tags"
                        render={(tags) => (
                            <>
                                {tags.map((tag) => (
                                    <Tag color="blue" key={tag}>
                                        {tag}
                                    </Tag>
                                ))}
                            </>
                        )}
                    />
                    <Column
                        title="操作"
                        key="action"
                        render={(_, record) => (
                            <Space size="middle">
                                <a onClick={this.checkMyGoodFlavor}>查看</a>

                            </Space>
                        )}
                    />
                </Table>


                <Modal
                    open={open}
                    title="寻味道表单"
                    //TODO:okText不是写死的,-1表示还未创建过,没有searchState
                    okText={searchState === -1 ?"创建":"修改"}
                    cancelText="取消"
                    destroyOnClose
                    //TODO:onOk, onCancel
                    //Note:使用refs提取Form中的数据
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    {/**Form表单的使用参见Form组件文档：搜索:Click or drag file to this area to upload */}
                    <Form
                        preserve={false}
                        ref={this.form}>
                        <Form.Item label="用户id">
                            <span> {userid} </span>
                        </Form.Item>
                        <Form.Item name="flavorType" label="味道类型" initialValue={flavorType}>
                            {/**
                         * //TODO:需要确认Radio的使用方法
                         */}
                            <Radio.Group>
                                <Radio value="a">家乡小吃</Radio>
                                <Radio value="b">地方特色小馆</Radio>
                                <Radio value="c">香辣味</Radio>
                                <Radio value="d">甜酸味</Radio>
                                <Radio value="e">绝一味</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="请求主题" name="theme" initialValue={theme}>
                            <Input placeholder='请求主题名称' />
                        </Form.Item>
                        <Form.Item label="description" name="description" initialValue={description}>
                            <Input placeholder='请求描述'>
                            </Input>
                        </Form.Item>
                        {/** //TODO:最高单价 */}


                        {/**Note:想要initialValue有效, name属性必须有, 因为name属性有了后, Form.Item才能
                         * 接管子组件的value
                         * initialValue 不能被 setState 动态更新，你需要用 setFieldsValue 来更新。
                         */}
                        <Form.Item label="请求创建日期" name="searchCreateTime" initialValue={dayjs(searchCreateTime)}>
                            <DatePicker showTime >
                            </DatePicker>
                        </Form.Item>
                        <Form.Item label="请求结束日期" name="searchChangeTime" initialValue={dayjs(searchChangeTime)}>
                            <DatePicker showTime>
                            </DatePicker>
                        </Form.Item>
                        <Form.Item label="请求结束日期" name="searchEndTime" initialValue={dayjs(searchEndTime)}>
                            <DatePicker showTime>
                            </DatePicker>
                        </Form.Item>
                    </Form>
                </Modal>
            </>
        )
    }
}
