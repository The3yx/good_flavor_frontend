import React, { Component } from 'react'
import { connect } from "react-redux";
import { Button, Modal, Form, Input, message } from 'antd';
import { Table, Tag, Space, } from 'antd';
import { SearchOutlined, } from "@ant-design/icons";
import Highlighter from 'react-highlight-words';
import axios from 'axios';
import dayjs from 'dayjs';
import { getBase64 } from '../../utils/getBase64';
import TextArea from 'antd/es/input/TextArea';

const { Column, ColumnGroup } = Table;

//TODO:响应状态数字到状态的对应关系
class MyTaste extends Component {
  state = {
    tasteData: [],
    searchedColumn: '',
    searchText: '',
    taste_id: 0,
    open: false,
    modalState: {
      id:-1,
      user_id:-1,
      req_id: -1,
      description: '',
      crea_time: '',
      //mod_time:'',
      state: -1,
    },
    description: ''

  }

  searchInput = React.createRef()

  changeMyTaste = () => {
    this.setState({ open: true })
  }


  deleteMyTaste = () => {
    //TODO:删除操作可以再确认一次，不改也行
    const { taste_id } = this.state
    axios({
      url: '/our/data/taste/delete',
      method: 'post',
      params: {
        id: taste_id
      }
    })
      .then(
        (res) => {
          console.log(res)
          message.success("删除成功")
          const { userData } = this.props
          axios({
            url: '/our/data/taste/query1',
            method: 'get',
            params: {
              user_id: userData.id
            }
          })
            .then(
              (res => {
                const data = res.data
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
      )
      .catch(
        (err) => {
          message.error("删除失败")
        }
      )

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
      url: '/our/data/taste/query1',
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
                modalState.req_id= record.req_id
                modalState.id = record.id
                modalState.description = record.description
                modalState.crea_time = record.crea_time
                modalState.state = record.state
                this.setState({ taste_id: record.id, modalState })
              }, // 鼠标移入行
              onMouseLeave: event => { },
            };
          }}>
          {/** //TODO:增加一列请求状态 */}
          <Column title="请品鉴标识" dataIndex="id" key="id" {...this.getColumnSearchProps('id')} />
          <Column title="请品鉴描述" dataIndex="description" key="description" {...this.getColumnSearchProps('description')} />
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
                <a onClick={this.changeMyTaste}>编辑</a>
                <a onClick={this.deleteMyTaste}>删除</a>
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
            var dateString = new Date().toISOString()
            dateString = dateString.substring(0, dateString.length - 1);
            axios({
              url: '/our/data/taste/change',
              method: 'post',
              data: {
                req_id: modalState.req_id,
                user_id: modalState.user_id,
                description: description,
                state: modalState.state,
                crea_time: modalState.crea_time,
                mod_time: dateString,
                id:modalState.id
              }
            })
              .then(
                (res) => {
                  message.success("修改成功")
                  axios({
                    url: '/our/data/taste/query1',
                    method: 'get',
                    params: {
                      user_id: userData.id
                    }
                  })
                    .then(
                      (res => {
                        const data = res.data
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
              )
              .catch(
                (err) => {
                  message.error("修改失败")
                }
              )
            this.setState({ open: false })
          }}
          onCancel={() => {
            this.setState({ open: false })
          }}>
          <TextArea
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

export default connect((state) => ({ userData: state.userData }), {})(MyTaste);