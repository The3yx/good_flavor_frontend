import React, { Component } from 'react'
import { Button, Modal, Form, Input } from 'antd';
import { Table, Tag, Space, DatePicker, Radio } from 'antd';
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from 'react-highlight-words';
import axios from 'axios';
import dayjs from 'dayjs';

const { Column, ColumnGroup } = Table;

export default class MyGoodFlavor extends Component {
    state = {
        goodFlavorData: [
            //test data
            //Note:数据属性比Table列属性多问题, 只要能覆盖就行,而且后续onRow中的record还能取出来所有数据
            {
                key:'1',
                userid: 'test1',
                theme:'theme1',
                tags:['testtag1'],
                test:'1'
            },
            {
                key:'2',
                userid: 'test2',
                theme:'theme2',
                tags:['testtag2'],
                test:'1'
            },
            {
                key:'3',
                userid: 'test3',
                theme:'theme3',
                tags:['testtag3'],
                test:'1'
            }
        ],
        open: false,
        modalState: {
            userid: '',
            flavorType: '',
            theme: '',
            description: '',
            maxprice: 1,
            goodFlavorCreateTime: new Date().toISOString(),
            goodFlavorChangeTime: new Date().toISOString(),
            goodFlavorEndTime: new Date().toISOString(),
            goodFlavorState: -1,
            picture: ''
        },
        searchedColumn:'',
        searchText:'',

    }

    form = React.createRef()
    searchInput =  React.createRef()

    addMyGoodFlavor = () => {
        const open = this.state.open
        this.setState({ open: true })
    }

    checkMyGoodFlavor = () => {
        this.setState({ open: true })
    }

    handleOk = () => {
        console.log(this.form.current.getFieldsValue())
        this.setState({ open: false })
    }

    handleCancel = () => {
        this.setState({ open: false })
    }


    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({searchText:selectedKeys[0], searchedColumn:dataIndex})
    };
    handleReset = (clearFilters, confirm) => {
        clearFilters();
        confirm()
        this.setState({searchText:''})
    };

    getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={this.searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        确认
                    </Button>
                    <Button
                        onClick={() => clearFilters && this.handleReset(clearFilters, confirm)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        重置
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => this.searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    render() {
        const open = this.state.open
        const modalState = this.state.modalState
        const goodFlavorData = this.state.goodFlavorData
        console.log(modalState.goodFlavorCreateTime)
        return (
            <>
                <Button onClick={this.addMyGoodFlavor}>
                    添加我的寻味道
                </Button>

                {/** //TODO:Table还缺少行选择事件与筛选能力 */}
                <Table dataSource={goodFlavorData}
                        onRow={record => {
                            return {
                              onClick: event => {
                                //TODO:按下面示例更新modelState
                                modalState.userid = record.userid
                                this.setState({modalState})
                              }, // 点击行
                              onDoubleClick: event => {},
                              onContextMenu: event => {},
                              onMouseEnter: event => {}, // 鼠标移入行
                              onMouseLeave: event => {},
                            };
                          }}>
                    <Column title="发布用户" dataIndex="userid" key="userid" {...this.getColumnSearchProps('userid')}/>
                    <Column title="寻味道主题" dataIndex="theme" key="theme" {...this.getColumnSearchProps('theme')}/>
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
                                <a onClick={this.checkMyGoodFlavor}>删除</a>
                            </Space>
                        )}
                    />
                </Table>


                <Modal
                    open={open}
                    title="寻味道表单"
                    //TODO:okText不是写死的,-1表示还未创建过,没有searchState
                    okText={modalState.goodFlavorState === -1 ? "创建" : "修改"}
                    cancelText="取消"
                    destroyOnClose={true}
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
                            <span> {modalState.userid} </span>
                        </Form.Item>
                        <Form.Item name="flavorType" label="味道类型" initialValue={modalState.flavorType}>
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
                        <Form.Item label="请求主题" name="theme" initialValue={modalState.theme}>
                            <Input placeholder='请求主题名称' />
                        </Form.Item>
                        <Form.Item label="description" name="description" initialValue={modalState.description}>
                            <Input placeholder='请求描述'>
                            </Input>
                        </Form.Item>
                        {/** //TODO:最高单价 */}


                        {/**Note:想要initialValue有效, name属性必须有, 因为name属性有了后, Form.Item才能
                         * 接管子组件的value
                         * initialValue 不能被 setState 动态更新，你需要用 setFieldsValue 来更新。
                         */}
                        <Form.Item label="请求创建日期" name="searchCreateTime" initialValue={dayjs(modalState.goodFlavorCreateTime)}>
                            <DatePicker showTime >
                            </DatePicker>
                        </Form.Item>
                        <Form.Item label="请求结束日期" name="searchChangeTime" initialValue={dayjs(modalState.goodFlavorChangeTime)}>
                            <DatePicker showTime>
                            </DatePicker>
                        </Form.Item>
                        <Form.Item label="请求结束日期" name="searchEndTime" initialValue={dayjs(modalState.goodFlavorEndTime)}>
                            <DatePicker showTime>
                            </DatePicker>
                        </Form.Item>
                    </Form>
                </Modal>
            </>
        )
    }
}
