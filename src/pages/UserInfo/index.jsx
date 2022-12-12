import React, { Component } from 'react'
import { connect } from "react-redux";

import { Button, Modal, Form, Input, message } from 'antd';
import { Table, Tag, Space, DatePicker, Radio } from 'antd';

import './index.css'
import axios from 'axios';
import { receiveUser } from '../../redux/actions';

const { TextArea } = Input
//TODO:更新密码框时和更新手机号还需要验证格式
class UserInfo extends Component {
  state = {
    infoChange: false,
    open: false,
    openCheck: false
  }

  form = React.createRef()  //UserInfo页面表单的ref
  modalForm = React.createRef()   //修改密码页面表单的ref
  checkModalForm = React.createRef()  //验证密码表单的ref

  handleOkCheck = () => {
    const { password } = this.checkModalForm.current.getFieldsValue()
    const { phone_number, description } = this.form.current.getFieldsValue()
    const { userData } = this.props
    var dateString = new Date().toISOString()
    dateString = dateString.substring(0, dateString.length - 1);

    axios({
      url: '/our/login',
      method: 'post',
      data: {
        username: userData.username,
        password: password
      }
    })
      .then(
        (res) => {
          axios({
            url: '/our/change',
            method: 'post',
            data: {
              username: userData.username,
              id_admin: userData.is_admin,
              name: userData.name,
              id_type: userData.id_type,
              id_number: userData.id_number,
              phone_number: phone_number,
              is_vip: userData.is_vip,
              description: description,
              city: userData.city,
              reg_time: userData.reg_time,
              mod_time: dateString,
              id: userData.id,
              password: password
            }
          })
            .then(
              (res) => {
                console.log('change', res.data)
                const newUserData = {
                  ...res.data,
                  access_token: userData.access_token,
                  reg_time: userData.reg_time,
                  id: userData.id
                }
                this.props.receiveUser(newUserData)
                this.setState({ infoChange: false })
                message.success("修改个人信息成功")
              }
            )
            .catch(
              (err) => {
                console.log(err)
                message.error("修改个人信息失败")
              }
            )
        }
      )
      .catch(
        (err)=>{
          message.error('修改个人信息失败')
        }
      )


    this.setState({ openCheck: false })
  }

  handleCancelCheck = () => {
    this.setState({ openCheck: false })
  }

  handleOk = () => {
    const { userData } = this.props
    var dateString = new Date().toISOString()
    dateString = dateString.substring(0, dateString.length - 1);
    const { oldPassword, newPassword, confirmNewPassword } = this.modalForm.current.getFieldsValue()
    if (newPassword !== confirmNewPassword) {
      alert("新密码不一致")
    }
    
    axios({
      url: '/our/login',
      method: 'post',
      data: {
        username: userData.username,
        password: oldPassword
      }
    })
      .then(
        (res) => {
          //登录成功
          axios({
            url: '/our/change',
            method: 'post',
            data: {
              username: userData.username,
              id_admin: userData.is_admin,
              name: userData.name,
              id_type: userData.id_type,
              id_number: userData.id_number,
              phone_number: userData.phone_number,
              is_vip: userData.is_vip,
              description: userData.description,
              city: userData.city,
              reg_time: userData.reg_time,
              mod_time: dateString,
              id: userData.id,
              password: newPassword
            }
          })
            .then(
              (res) => {
                message.success("修改密码成功")
              }
            )
            .catch(
              (err) => {
                message.error("修改密码失败")
              }
            )
        }
      )
      .catch(
        (err) => {
          message.error("旧密码错误")
        }
      )
    this.setState({ open: false })
  }

  handleCancel = () => {
    this.setState({ open: false })
  }

  render() {
    const infoChange = this.state.infoChange
    const open = this.state.open
    const openCheck = this.state.openCheck
    const { userData } = this.props
    return (
      <div className='userinfo-content'>
        <Form
          ref={this.form}
          labelAlign="left"
          labelCol={{ flex: '75px' }}
          wrapperCol={
            { flex: '1' }}>

          <Form.Item label="用户id">
            <span>
              {userData.id}
            </span>
          </Form.Item>
          <Form.Item label="用户名">
            <span>
              {userData.username}
            </span>
          </Form.Item>
          <Form.Item label="姓名">
            <span>
              {userData.name}
            </span>
          </Form.Item>
          <Form.Item label="注册城市">
            <span>
              {userData.city}
            </span>
          </Form.Item>
          <Form.Item label="手机号码" name="phone_number" initialValue={userData.phone_number}>
            <Input
              disabled={!infoChange}>
            </Input>
          </Form.Item>
          <Form.Item label="个人简介" name="description" initialValue={userData.description}>
            <TextArea
              disabled={!infoChange}
              rows={1}
              placeholder="个人简介">
            </TextArea>
          </Form.Item>
          <Form.Item>
            <div>
              <Button
                onClick={() => {
                  if (infoChange === false)
                    this.setState({ infoChange: true })
                  else {
                    this.setState({ openCheck: true })
                  }
                }}>
                {infoChange === true ? '确认修改' : '修改信息'}
              </Button>
              <Button
                className='infoChangeCancel'
                style={{ display: infoChange === true ? 'inline' : 'none' }}
                onClick={() => {
                  this.form.current.setFieldsValue({
                    'phone_number': userData.phone_number,
                    'description': userData.description
                  })
                  this.setState({ infoChange: false })
                }}>
                取消修改
              </Button>
            </div>
          </Form.Item>
          <Form.Item>
            <Button
              onClick={() => {
                this.setState({ open: true })
              }}>
              修改密码
            </Button>
          </Form.Item>
        </Form>


        {/**修改信息密码验证对话框 */}
        <Modal
          title="身份验证"
          okText="确认"
          cancelText="取消"
          onOk={this.handleOkCheck}
          onCancel={this.handleCancelCheck}
          destroyOnClose={true}
          open={openCheck}>
          <Form
            preserve={false}
            ref={this.checkModalForm}
          >
            <Form.Item label="密码" name="password">
              <Input type='password' placeholder='请输出密码'>
              </Input>
            </Form.Item>
          </Form>
        </Modal>

        {/**修改密码对话框 */}
        <Modal
          title="修改密码"
          okText="确认"
          cancelText="取消"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose={true}
          open={open}>
          <Form
            preserve={false}
            ref={this.modalForm}
            labelAlign="left"
            labelCol={{ flex: '75px' }}
            wrapperCol={
              { flex: '1' }}>
            <Form.Item label="密码" name="oldPassword">
              <Input
                type='password'
                placeholder='请输入旧密码'>
              </Input>
            </Form.Item>
            <Form.Item label="新密码" name="newPassword">
              <Input
                type='password'
                placeholder='请输入新密码'>
              </Input>
            </Form.Item>
            <Form.Item label="密码" name="confirmNewPassword">
              <Input
                type='password'
                placeholder='请再次输入新密码'>
              </Input>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default connect((state) => ({ userData: state.userData }), { receiveUser })(UserInfo);
