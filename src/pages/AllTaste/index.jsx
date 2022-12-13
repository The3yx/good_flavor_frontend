import React, { Component } from 'react'
import { connect } from "react-redux";
import { Button, Modal, Form, Input, message } from 'antd';
import { Table, Tag, Space, } from 'antd';
import { SearchOutlined, } from "@ant-design/icons";
import Highlighter from 'react-highlight-words';
import axios from 'axios';
import dayjs from 'dayjs';

import TextArea from 'antd/es/input/TextArea';
import { getAllUser } from '../../redux/actions';
import Item from 'antd/es/list/Item';
const { Column, ColumnGroup } = Table;

//TODO:响应状态数字到状态的对应关系
class AllTaste extends Component {
    state = {
        tasteData: [],
        searchedColumn: '',
        searchText: '',
        taste_id: 0,
        open: false,
        userModalOpen: false,
        modalState: {
            id: -1,
            user_id: -1,
            req_id: -1,
            description: '',
            crea_time: '',
            //mod_time:'',
            state: -1,
        },
        userModalState: {
            id:-1,
            username:'',
            name:'',
            city:'',
            phone_number:'',
            description:''
        },
        description: ''

    }

    searchInput = React.createRef()


    checkTaste = () => {
        this.setState({ open: true })
    }


    checkUser = () => {
        const {allUserData} = this.props
        const {userModalState} = this.state
        for(let item of allUserData){
            if(item.id === userModalState.id){
                userModalState.username = item.username
                userModalState.name = item.name
                userModalState.city = item.city
                userModalState.phone_number = item.phone_number
                userModalState.description = item.description
                this.setState({userModalState})
                break
            }
        }
        this.setState({userModalOpen:true})
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
        const { userData, allUserData, getAllUser } = this.props
        getAllUser()
        console.log('alluser', allUserData)
        axios({
            url: '/our/admin/all_taste_query',
            method: 'get',
        })
            .then(
                (res => {
                    const data = res.data
                    console.log(data)
                    this.setState({
                        tasteData: data.map((value, index) => {
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
        const { tasteData, open, modalState, description, userModalOpen, userModalState } = this.state
        const { userData } = this.props
        return (
            <>
                <Table dataSource={tasteData}
                    onRow={record => {
                        return {
                            onClick: event => { }, // 点击行
                            onDoubleClick: event => { },
                            onContextMenu: event => { },
                            onMouseEnter: event => {
                                modalState.user_id = record.user_id
                                modalState.req_id = record.req_id
                                modalState.id = record.id
                                modalState.description = record.description
                                modalState.crea_time = record.crea_time
                                modalState.state = record.state
                                userModalState.id = record.user_id
                                this.setState({ taste_id: record.id, modalState, userModalState })
                            }, // 鼠标移入行
                            onMouseLeave: event => { },
                        };
                    }}>
                    {/** //TODO:增加一列请求状态 */}
                    <Column title="请品鉴标识" dataIndex="id" key="id" {...this.getColumnSearchProps('id')} />
                    <Column title="请品鉴描述" dataIndex="description" key="description" {...this.getColumnSearchProps('description')} />
                    <Column title="请品鉴状态" dataIndex="state" key="state" 
                        render={(state)=>{
                            var stateString = ''
                            switch(state){
                                case 0: 
                                    stateString = '待接受'
                                    break
                                case 1: 
                                    stateString = '同意'
                                    break
                                case 2: 
                                    stateString = '拒绝'
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
                        title="响应状态"
                        dataIndex="state"
                        key="state"
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
                                <a onClick={this.checkTaste}>查看响应</a>
                                <a onClick={this.checkUser}>查看用户</a>
                            </Space>
                        )}
                    />
                </Table>


                {/**编辑请品鉴对话框 */}
                <Modal
                    open={open}
                    destroyOnClose={true}
                    okText="确认"
                    cancelText="取消"
                    onOk={() => {
                        this.setState({ open: false })
                    }}
                    onCancel={() => {
                        this.setState({ open: false })
                    }}>
                    <TextArea
                        disabled={true}
                        defaultValue={modalState.description}>
                    </TextArea>
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

export default connect((state) => ({ userData: state.userData, allUserData: state.allUserData }), { getAllUser })(AllTaste);