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

const { Column, ColumnGroup } = Table;

//TODO:好味道创建表单中不应该有修改时间和创建时间选择框...
class MyGoodFlavor extends Component {
    state = {
        goodFlavorData: [
        ],
        open: false,
        modalState: {
            id:0,
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

    addMyGoodFlavor = () => {
        const {modalState} = this.state
        modalState.id = 0
        modalState.userid = 0
        modalState.flavorType= ''
        modalState.theme=''
        modalState.description= ''
        modalState.maxprice=1
        modalState.goodFlavorCreateTime=new Date().toISOString()
        modalState.goodFlavorChangeTime=new Date().toISOString()
        modalState.goodFlavorEndTime=new Date().toISOString()
        modalState.goodFlavorState=-1
        modalState.picture=''
        const open = this.state.open

        this.setState({ open: true, modalState })
    }

    checkMyGoodFlavor = () => {
        this.setState({ open: true })
    }
    deleteMyGoodFlavor = () =>{
        const {id} = this.state.modalState
        const {userData} = this.props
        axios({
            url:'/our/data/search/delete',
            method:'post',
            params:{
                id:id
            }
        })
        .then(
            (res)=>{
                message.success("删除成功")
                axios({
                    url: '/our/data/search/query1',
                    method: 'get',
                    params: {
                        user_id: userData.id
                    }
                })
                    .then(
                        (res => {
                            const data = res.data
                            console.log(data)
                            this.setState({
                                goodFlavorData:data.map((value,index)=>{
                                    return {...value, key:value.id}
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
        )
        .catch(
            (err)=>{
                message.error("删除失败")
            }
        )
    }

    handleOk = async () => {
        const { flavorType, description, maxprice, picture, searchChangeTime, searchCreateTime, searchEndTime, theme } = this.form.current.getFieldsValue()
        const {id, goodFlavorState} = this.state.modalState
        const { userData } = this.props
        const createTime = searchCreateTime.format('YYYY-MM-DDTHH:mm:ss')
        const modifyTime = searchChangeTime.format('YYYY-MM-DDTHH:mm:ss')
        const endTime = searchEndTime.format('YYYY-MM-DD')
        var pictureString = this.state.modalState.picture
        if(picture)
            pictureString = await getBase64(picture.file)

        console.log(pictureString)
        if(goodFlavorState === -1){
            axios({
                url: '/our/data/search/add',
                method: 'post',
                data: {
                    user_id: userData.id,
                    flavor_type: flavorType,
                    req_name: theme,
                    req_description: description,
                    price: maxprice,
                    end_time: endTime,
                    photo: pictureString,
                    crea_time: createTime,
                    mod_time: modifyTime,
                    state: 0
                }
            })
                .then(
                    (res) => {
                        message.success("创建请求成功")
                        this.updateTable()
                    }
                )
                .catch(
                    (err) => {
                        message.success("创建请求失败")
                    }
                )
        }else{
            axios({
                url:'/our/data/search/change',
                method:'post',
                data:{
                    id:id,
                    user_id: userData.id,
                    flavor_type: flavorType,
                    req_name: theme,
                    req_description: description,
                    price: maxprice,
                    end_time: endTime,
                    photo: pictureString,
                    crea_time: createTime,
                    mod_time: modifyTime,
                    state: goodFlavorState
                }
            })
            .then(
                (res)=>{
                    message.success("修改成功")
                    this.updateTable()
                }
            )
            .catch(
                (err)=>{
                    message.error("修改失败")
                }
            )
        
        }
        
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
        this.updateTable()
    }

    updateTable = ()=>{
        const { userData } = this.props
        axios({
            url: '/our/data/search/query1',
            method: 'get',
            params: {
                user_id: userData.id
            }
        })
            .then(
                (res => {
                    const data = res.data
                    console.log(data)
                    this.setState({
                        goodFlavorData:data.map((value,index)=>{
                            return {...value, key:value.id}
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
        const { open, modalState, goodFlavorData, fileList, previewOpen, previewTitle, previewImage } = this.state

        return (
            <>
                <Button onClick={this.addMyGoodFlavor}>
                    添加我的寻味道
                </Button>


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
                                this.setState({ modalState,fileList:[{
                                    uid:'-1',
                                    status:'done',
                                    name:'image.png',
                                    url:record.photo
                                }] })
                            }, // 点击行
                            onDoubleClick: event => { },
                            onContextMenu: event => { },
                            onMouseEnter: event => {
                                modalState.id = record.id
                                this.setState({modalState})
                            }, // 鼠标移入行
                            onMouseLeave: event => { },
                        };
                    }}>
                    <Column title="寻味道标识" dataIndex="id" key="id" {...this.getColumnSearchProps('id')} />
                    <Column title="寻味道主题" dataIndex="req_name" key="req_name" {...this.getColumnSearchProps('req_name')} />
                    <Column title="寻味道状态" dataIndex="state" key="state" 
                        render={(state)=>{
                            var stateString = ''
                            switch(state){
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
                            return(<>
                                <Tag color="blue" key={stateString}>
                                    {stateString}
                                </Tag>
                            </>)
                            
                        }}/>
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
                                <a onClick={this.checkMyGoodFlavor}>查看</a>
                                <a onClick={this.deleteMyGoodFlavor}>删除</a>
                            </Space>
                        )}
                    />
                </Table>


                <Modal
                    open={open}
                    title="寻味道表单"
                    okText={modalState.goodFlavorState === -1 ? "创建" : "修改"}
                    cancelText="取消"
                    destroyOnClose={true}
                    //Note:使用refs提取Form中的数据
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    {/**Form表单的使用参见Form组件文档：搜索:Click or drag file to this area to upload */}
                    <Form
                        preserve={false}
                        ref={this.form}>
                        <Form.Item name="flavorType" label="味道类型" initialValue={modalState.flavorType}>
                            <Radio.Group>
                                <Radio value="家乡小吃">家乡小吃</Radio>
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
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => { this.setState({ previewOpen: false }) }}>
                    <img
                        alt="example"
                        style={{
                            width: '100%',
                        }}
                        src={previewImage}
                    />
                </Modal>
            </>
        )
    }
}

export default connect((state) => ({ userData: state.userData }), {})(MyGoodFlavor);