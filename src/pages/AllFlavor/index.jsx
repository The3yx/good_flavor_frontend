import React, { Component } from 'react'
import { connect } from "react-redux";
import { Button, Modal, Form, Input, message } from 'antd';
import { Table, Tag, Space, DatePicker, Radio, InputNumber, Image, Upload,Cascader } from 'antd';
import { UserOutlined, SearchOutlined, PlusOutlined } from "@ant-design/icons";
import Highlighter from 'react-highlight-words';
import axios from 'axios';
import dayjs from 'dayjs';
import { getBase64 } from '../../utils/getBase64';
import { getAllUser } from '../../redux/actions';
import getCityArray from "../../utils/getCityUtils";

const { TextArea } = Input

const { Column, ColumnGroup } = Table;

class AllFlavor extends Component {
    state = {
        goodFlavorData: [],
        open: false,
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
        },
        searchedColumn: '',
        searchText: '',
        previewImage: '',
        previewOpen: false,
        PreviewTitle: '',
        fileList: [],
        userModalOpen: false,
        userModalState: {
            id: -1,
            username: '',
            name: '',
            city: '',
            phone_number: '',
            description: ''
        },
        cityArray: [],
        selectCity:''
    }

    form = React.createRef()
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


    confirmCity = ()=>{
        const {selectCity} = this.state
        this.updateTable(selectCity)
    }

    componentWillMount = () => {
        axios({
            method: 'get',
            url: '/api/address/list',
            params: {
                app_id: "cqsitjqrmnfjmljl",
                //注意:这种字符串千万不要使用图片识别，容易得到全角字符导致难以发现问题
                app_secret: "aXpOMW5KNjNTYzJwR1h2VXRBRE9GUT09"
            }
        })
            .then(
                (res) => {
                    const cityArray = getCityArray(res.data.data)
                    this.setState({ cityArray: cityArray })

                }
            )
            .catch(
                (err) => {
                    alert("网络故障,请尝试刷新页面")
                }
            )
        const { userData} = this.props
        this.updateTable(userData.city)
    }

    updateTable = (city) => {
        const { getAllUser } = this.props
        getAllUser()
        axios({
            url: '/our/data/search/query2',
            method: 'get',
            params: {
                city: city
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
        const { open, modalState, goodFlavorData, fileList, previewOpen, previewTitle, previewImage, userModalState, userModalOpen,
            cityArray } = this.state

        return (
            <>
                <Cascader 
                    options={cityArray}
                    placeholder="请选择您所要查看城市"
                    onChange={(value)=>{
                        this.setState({selectCity:value[0]+value[1]})
                }}>
                </Cascader>
                <Button
                    onClick={this.confirmCity}>
                    确定
                </Button>
                <Table dataSource={goodFlavorData} bordered={true}
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
                                modalState.goodFlavorState = record.state
                                userModalState.id = record.user_id
                                this.setState({
                                    modalState, userModalState, fileList: [{
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
                    <Column title="用户标识" dataIndex="user_id" key="user_id" {...this.getColumnSearchProps('user_id')} />
                    <Column title="寻味道主题" dataIndex="req_name" key="req_name" {...this.getColumnSearchProps('req_name')} />
                    <Column title="寻味道状态" dataIndex="state" key="state"
                        render={(state) => {
                            var stateString = ''
                            switch (state) {
                                case 0:
                                    stateString = '待响应'
                                    break
                                case 1:
                                    stateString = '已完成'
                                    break
                                case 2:
                                    stateString = '到期未达成'
                                    break
                                default:
                                    stateString = "error"
                            }
                            return (<>
                                <Tag color="blue" key={stateString}>
                                    {stateString}
                                </Tag>
                            </>)

                        }} />
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
                                <a onClick={this.checkGoodFlavor}>查看请求</a>
                                <a onClick={() => {
                                    const { allUserData } = this.props
                                    for (let item of allUserData) {
                                        if (item.id === userModalState.id) {
                                            userModalState.username = item.username
                                            userModalState.name = item.name
                                            userModalState.city = item.city
                                            userModalState.phone_number = item.phone_number
                                            userModalState.description = item.description
                                            this.setState({ userModalState })
                                            break
                                        }
                                    }
                                    this.setState({ userModalOpen: true })
                                }}>查看用户</a>
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
                        labelAlign="left"
                        labelCol={{ flex: '100px' }}
                        wrapperCol={
                          { flex: '1' }}
                        disabled={true}
                        preserve={false}
                        ref={this.form}>
                        <Form.Item name="flavorType" label="味道类型" initialValue={modalState.flavorType}>
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

                {/**用户信息对话框 */}
                <Modal
                    open={userModalOpen}
                    destroyOnClose={true}
                    okText="确认"
                    cancelText="取消"
                    onOk={() => {
                        this.setState({ userModalOpen: false })
                    }}
                    onCancel={() => {
                        this.setState({ userModalOpen: false })
                    }}>
                    <Form
                        disabled={true}
                        labelAlign="left"
                        labelCol={{ flex: '75px' }}
                        wrapperCol={
                            { flex: '1' }}>

                        <Form.Item label="用户id">
                            <span>
                                {userModalState.id}
                            </span>
                        </Form.Item>
                        <Form.Item label="用户名">
                            <span>
                                {userModalState.username}
                            </span>
                        </Form.Item>
                        <Form.Item label="姓名">
                            <span>
                                {userModalState.name}
                            </span>
                        </Form.Item>
                        <Form.Item label="注册城市">
                            <span>
                                {userModalState.city}
                            </span>
                        </Form.Item>
                        <Form.Item label="手机号码" name="phone_number" initialValue={userModalState.phone_number}>
                            <Input>
                            </Input>
                        </Form.Item>
                        <Form.Item label="个人简介" name="description" initialValue={userModalState.description}>
                            <TextArea
                                rows={3}
                                placeholder="个人简介">
                            </TextArea>
                        </Form.Item>
                    </Form>

                </Modal>

            </>
        )
    }
}

export default connect((state) => ({ userData: state.userData, allUserData: state.allUserData }), { getAllUser })(AllFlavor);