import React, { Component } from 'react'
import { connect } from "react-redux";
import { Button, Modal, Form, Input, message } from 'antd';
import { Table, Tag, Space, DatePicker, Radio, InputNumber, Image, Upload } from 'antd';
import { UserOutlined, SearchOutlined, PlusOutlined } from "@ant-design/icons";
import Highlighter from 'react-highlight-words';
import axios from 'axios';
import dayjs from 'dayjs';
import { getBase64 } from '../../utils/getBase64';
import { base64ToFile } from '../../utils/base64ToFile';
const { TextArea } = Input

const { Column, ColumnGroup } = Table;

class GoodFlavorHall extends Component {
    state = {
        goodFlavorData: [
        ],
        open: false,
        responseOpen: false,
        modalState: {
            id: 0,
            userid: 0,
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
        searchedColumn: '',
        searchText: '',
        previewImage: '',
        previewOpen: false,
        PreviewTitle: '',
        fileList: []

    }

    form = React.createRef()
    responseForm = React.createRef()
    searchInput = React.createRef()

    uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                添加图片
            </div>
        </div>
    );

    handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        this.setState({
            previewImage: file.url || file.preview,
            previewOpen: true,
            PreviewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
        })

    };

    handleChange = ({ fileList: newFileList }) => this.setState({ fileList: newFileList });

    beforeUpload = (file) => {
        return false
    }


    checkGoodFlavor = () => {
        this.setState({ open: true })
    }

    responseTaste = () => {
        this.setState({ responseOpen: true })
    }

    hadnleResponseOk = () => {
        const { id } = this.state.modalState
        const { response } = this.responseForm.current.getFieldsValue()
        const { userData } = this.props
        var dateString = new Date().toISOString()
        dateString = dateString.substring(0, dateString.length - 1);
        axios({
            url: '/our/data/taste/add',
            method: 'post',
            data: {
                req_id: id,
                user_id: userData.id,
                description: response,
                crea_time: dateString,
                mod_time: dateString,
                state: 0
            }
        })
            .then(
                (res) => {
                    message.success("响应成功")
                }
            )
            .catch(
                (err) => {
                    message.error("响应失败")
                }
            )
        this.setState({ responseOpen: false })
    }

    hadnleResponseCancel = () => {
        this.setState({ responseOpen: false })
    }

    handleOk = async () => {
        this.setState({ open: false })
    }

    handleCancel = () => {
        this.setState({ open: false })
    }


    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({ searchText: selectedKeys[0], searchedColumn: dataIndex })
    };
    handleReset = (clearFilters, confirm) => {
        clearFilters();
        confirm()
        this.setState({ searchText: '' })
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


    componentWillMount = () => {
        const { userData } = this.props
        axios({
            url: '/our/data/search/query2',
            method: 'get',
            params: {
                city: userData.city
            }
        })
            .then(
                (res => {
                    const data = res.data
                    console.log('query2', data)
                    this.setState({
                        goodFlavorData: data.map((value, index) => {
                            return { ...value, key: value.id }
                        })
                    })

                })
            )
            .catch(
                (err) => {
                    console.log(err)
                }
            )
    }
    render() {
        const { open, modalState, goodFlavorData, fileList, previewOpen, previewTitle, previewImage, responseOpen } = this.state

        return (
            <>
                <Table dataSource={goodFlavorData}
                    onRow={record => {
                        return {
                            onClick: event => {
                                modalState.userid = record.user_id
                                modalState.description = record.req_description
                                modalState.flavorType = record.flavor_type
                                modalState.goodFlavorEndTime = record.end_time
                                modalState.maxprice = record.price
                                modalState.theme = record.req_name
                                modalState.goodFlavorCreateTime = record.crea_time
                                modalState.goodFlavorChangeTime = record.mod_time
                                modalState.picture = record.photo
                                modalState.goodFlavorState = record.state
                                this.setState({
                                    modalState, fileList: [{
                                        uid: '-1',
                                        status: 'done',
                                        name: 'image.png',
                                        url: record.photo
                                    }]
                                })
                            }, // 点击行
                            onDoubleClick: event => { },
                            onContextMenu: event => { },
                            onMouseEnter: event => {
                                modalState.id = record.id
                                this.setState({ modalState })
                            }, // 鼠标移入行
                            onMouseLeave: event => { },
                        };
                    }}>
                    {/** //TODO:增加一列请求状态 */}
                    <Column title="用户标识" dataIndex="user_id" key="user_id" {...this.getColumnSearchProps('user_id')} />
                    <Column title="寻味道主题" dataIndex="req_name" key="req_name" {...this.getColumnSearchProps('req_name')} />
                    <Column
                        title="味道类型"
                        dataIndex="flavor_type"
                        key="flavor_type"
                        render={(tag) => (
                            <>
                                <Tag color="blue" key={tag}>
                                    {tag}
                                </Tag>
                            </>
                        )}
                    />
                    <Column
                        title="操作"
                        key="action"
                        render={(_, record) => (
                            <Space size="middle">
                                <a onClick={this.checkGoodFlavor}>查看</a>
                                <a onClick={this.responseTaste}>响应</a>
                            </Space>
                        )}
                    />
                </Table>


                <Modal
                    open={open}
                    title="寻味道表单"
                    okText="确认"
                    cancelText="取消"
                    destroyOnClose={true}
                    //Note:使用refs提取Form中的数据
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    {/**Form表单的使用参见Form组件文档：搜索:Click or drag file to this area to upload */}
                    <Form
                        disabled={true}
                        preserve={false}
                        ref={this.form}>
                        <Form.Item name="flavorType" label="味道类型" initialValue={modalState.flavorType}>
                            {/**
                         * //TODO:需要确认Radio的使用方法
                         */}
                            <Radio.Group>
                                <Radio value="嘉兴小吃">家乡小吃</Radio>
                                <Radio value="地方特色小馆">地方特色小馆</Radio>
                                <Radio value="香辣味">香辣味</Radio>
                                <Radio value="甜酸味">甜酸味</Radio>
                                <Radio value="绝一味">绝一味</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="请求主题" name="theme" initialValue={modalState.theme}>
                            <Input placeholder='请求主题名称' />
                        </Form.Item>
                        <Form.Item label="请求描述" name="description" initialValue={modalState.description}>
                            <Input placeholder='请求描述'>
                            </Input>
                        </Form.Item>

                        <Form.Item name="picture" label="图片">
                            {/**Upload中的图片的default有点问题 */}
                            <Upload
                                accept='.png,.jpg'
                                listType='picture-card'
                                fileList={fileList}
                                onPreview={this.handlePreview}
                                onChange={this.handleChange}
                                beforeUpload={this.beforeUpload}>

                                {fileList.length >= 1 ? null : this.uploadButton}
                            </Upload>
                        </Form.Item>
                        <Form.Item label="最高单价" name="maxprice" initialValue={modalState.maxprice}>
                            <InputNumber addonBefore="+" addonAfter="￥" placeholder='最高单价' />
                        </Form.Item>

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
                            <DatePicker>
                            </DatePicker>
                        </Form.Item>
                    </Form>
                </Modal>

                {/**预览图片的Modal */}
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => { this.setState({ previewOpen: false }) }}
                >
                    <img
                        alt="example"
                        style={{
                            width: '100%',
                        }}
                        src={previewImage}
                    />
                </Modal>

                {/**请品鉴对话框 */}
                <Modal
                    title="请品鉴表单"
                    destroyOnClose={true}
                    open={responseOpen}
                    okText="确认"
                    cancelText="取消"
                    onOk={this.hadnleResponseOk}
                    onCancel={this.hadnleResponseCancel}>
                    <Form
                        ref={this.responseForm}
                        preserve={false}>
                        <Form.Item label="响应描述" name="respone">
                            <TextArea
                                style={{ borderRadius: "5px" }}
                                rows={3}
                                placeholder="响应描述">
                            </TextArea>
                        </Form.Item>

                    </Form>
                </Modal>
            </>
        )
    }
}

export default connect((state) => ({ userData: state.userData }), {})(GoodFlavorHall);