import React, { Component } from 'react'
import { connect } from "react-redux";
import { Button, Modal, Form, Input, message, Popconfirm } from 'antd';
import { Table, Tag, Space, } from 'antd';
import { SearchOutlined, } from "@ant-design/icons";
import Highlighter from 'react-highlight-words';
import axios from 'axios';
import dayjs from 'dayjs';
import { getBase64 } from '../../utils/getBase64';

const {TextArea}  = Input
const { Column, ColumnGroup } = Table;

class MyResponse extends Component {
  state = {
    tasteData: [],
    searchedColumn: '',
    searchText: '',
    taste_id: 0,
    req_id:0,
    user_id:0,
    open: false,
    modalState: {
      id: -1,
      user_id: -1,
      req_id: -1,
      description: '',
      crea_time: '',
      //mod_time:'',
      state: -1,
    },
    description: ''

  }

  searchInput = React.createRef()

  cancel = ()=>{

  }
  checkResponse = () => {
    this.setState({ open: true })
  }

  receiveResponse = () => {
    const {taste_id, req_id, user_id} = this.state
    const {userData} = this.props
    //更新请品鉴
    axios({
      url:'/our/data/taste/update_state',
      method:'post',
      params:{
        id:taste_id,
        s:1
      }
    })
    .then(
      (res)=>{
        message.success("接受成功")
        this.updateTable()
      }
    )
    .catch(
      (err)=>{
        message.success("接受失败")
      }
    )
    //更新寻味道
    axios({
      url:'/our/data/search/update_state',
      method:'post',
      params:{
        id:req_id,
        s:1,
      }
    })
    .then(res=>{
      console.log(res)
    })
    .catch(err=>{
      console.log(err)
    })

    var dateString = dayjs().format("YYYY-MM-DD")
    axios({
      url:'/our/data/success_add',
      method:'post',
      data:{
        req_id:req_id,
        user1_id:userData.id,
        user2_id:user_id,
        finish_time:dateString,
        fee1:3,
        fee2:1
      }
    })
    .then((res=>{
      console.log(res)
    }))
    .catch((err)=>{
      console.log(err)
    })
  }
  refuseResponse = () => {
    const {taste_id, req_id} = this.state
    axios({
      url:'/our/data/taste/update_state',
      method:'post',
      params:{
        id:taste_id,
        s:2
      }
    })
    .then(
      (res)=>{
        message.success("拒绝成功")
        this.updateTable()
      }
    )
    .catch(
      (err)=>{
        message.success("拒绝失败")
      }
    )
    axios({
      url:'/our/data/search/update_state',
      method:'post',
      params:{
        id:req_id,
        s:0
      }
    })
    .then(res=>{
      console.log(res)
    })
    .catch(err=>{
      console.log(err)
    })
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
  updateTable = () =>{
    const { userData } = this.props
    axios({
      url: '/our/data/taste/query2',
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
    const { tasteData, open, modalState, description } = this.state
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
                this.setState({ taste_id: record.id, req_id:record.req_id, user_id: record.user_id, modalState })
              }, // 鼠标移入行
              onMouseLeave: event => { },
            };
          }}>
          <Column title="寻味道标识" dataIndex="req_id" key="req_id" {...this.getColumnSearchProps('req_id')} />
          <Column title="响应标识" dataIndex="id" key="id" {...this.getColumnSearchProps('id')} />
          <Column title="响应描述" dataIndex="description" key="description" {...this.getColumnSearchProps('description')} />
          <Column title="响应状态" dataIndex="state" key="state" 
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
            title="操作"
            key="action"
            render={(_, record) => {
              return(
                <Space size="middle">
                <a onClick={this.checkResponse}>查看</a>
                {/**使用气泡确认框 */}
                <Popconfirm
                  title="确认接受？"
                  onConfirm={this.receiveResponse}
                  onCancel={this.cancel}
                  okText="是"
                  cancelText="否"
                >
                  <a style={{display:record.state == 0?"inline":"none"}} href="#">接受</a>
                </Popconfirm>
                <Popconfirm
                  title="确认拒绝？"
                  onConfirm={this.refuseResponse}
                  onCancel={this.cancel}
                  okText="是"
                  cancelText="否"
                >
                  <a style={{display:record.state == 0?"inline":"none"}} href="#">拒绝</a>
                </Popconfirm>
              </Space>
              )
            }}
          />
        </Table>


        {/**查看请品鉴对话框 */}
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
            defaultValue={modalState.description}
            onChange={(e) => {
              const value = e.target.value
              this.setState({ description: value })
            }}>
          </TextArea>
        </Modal>


      </>
    )
  }
}
export default connect((state) => ({ userData: state.userData }), {})(MyResponse);
