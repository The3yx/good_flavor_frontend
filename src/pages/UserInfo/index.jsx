import React, { Component } from 'react'
import { connect } from "react-redux";

import { Button, Modal, Form, Input } from 'antd';
import { Table, Tag, Space, DatePicker, Radio } from 'antd';

import './index.css'
const { TextArea } = Input
class UserInfo extends Component {
  state = {
    infoChange: true,
    open: false
  }

  form = React.createRef()  //UserInfo页面表单的ref
  modalForm = React.createRef()

  handleOk = () => {
    console.log(this.modalForm.current.getFieldsValue())
    this.setState({ open: false })
  }

  handleCancel = () => {
    this.setState({ open: false })
  }

  render() {
    const infoChange = this.state.infoChange
    const open = this.state.open
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
              disabled={infoChange}>
            </Input>
          </Form.Item>
          <Form.Item label="个人简介" name="description" initialValue={userData.description}>
            <TextArea
              disabled={infoChange}
              rows={1}
              placeholder="个人简介"
              maxLength={6}>
            </TextArea>
          </Form.Item>
          <Form.Item>
            <div>
              <Button
                onClick={() => {
                  this.setState({ infoChange: false })
                }}>
                {infoChange === false ? '确认修改' : '修改信息'}
              </Button>
              <Button
                className='infoChangeCancel'
                style={{ display: infoChange === false ? 'inline' : 'none' }}
                onClick={() => {
                  //TODO:取消修改时要把修改的Input框value改成defaultValue
                  this.form.current.setFieldsValue({
                    'phone_number': userData.phone_number,
                    'description': userData.description
                  })
                  this.setState({ infoChange: true })
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

export default connect((state) => ({ userData: state.userData }), {})(UserInfo);
