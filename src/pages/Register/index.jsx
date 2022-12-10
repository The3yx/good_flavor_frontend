/**
 * @author:shanmu
 * @time:2022.04.29
 */
import React, { Component } from "react";
//import logo from "../../assets/image/head.jpg";
import { Form, Input, Button, Cascader, Select, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { NavLink, Redirect } from "react-router-dom";
import "./index.css";
import { connect } from "react-redux";
import axios from 'axios';
import getCityArray from "../../utils/getCityUtils";

/**
 * 注册要求:
 * 1. 用户名:   无
 * 2. 密码:     不少于6位,含有至少两个数字,不能都为大写或小写
 * 3. 证件类型: 无
 * 4. 证件号码: 无
 * 5. 用户级别: 无
 * 6. 用户简介: 无
 * 7. 注册城市：无
 */

class Register extends Component {
  state = {
    isRegisterSuccess: false,
    cityArray: []
  }

  registerData = {

  }

  onFinish = (values) => {
    console.log('call onFinish')
    console.log(values)
    const { username, password, confirmPassword,idType,place } = values;
    //TODO:取值发送注册消息,设置isRegisterSuccess
    if (password !== confirmPassword) {
      return alert("密码不一致")
    }

    
  };
  onFinishFailed = (values, errorFields, outOfDate) => {
    values.errorFields.map((x) => {
      return console.log(x.errors);
    });
  };
  validatePwd = (rule, value) => {
    if (!value) {
      return Promise.reject("请输入密码!");
    } else if (value.length < 6) {
      return Promise.reject("密码不能小于6");
    } else if (!/^[0-9]+$/.test(value)) {
      let count = 0
      for(let c of value){
        let numReg = /^[0-9]+.?[0-9]*/
        if (numReg.test(c)){
          count += 1
        }
      }
      if(count<2)
        return Promise.reject("密码必须含有两个数字");
    } else {
      return Promise.resolve(); //验证通过
    }
  };

  validateIdNumber = (rule, value) => {
    //证件号码的格式设定为数字组成即可
    if (!value) {
      return Promise.reject("证件号码必须输入");
    } else if (!/^[0-9]+$/.test(value)) {
      return Promise.reject("证件号码格式不正确");
    } else {
      return Promise.resolve(); //验证通过
    }
  }

  validatePhoneNumber = (rule, value) => {
    if (!value) {
      return Promise.reject("手机号必须输入");
    } else if (!/^[0-9]+$/.test(value)) {
      return Promise.reject("手机号格式不正确");
    } else if (value.length !== 11) {
      return Promise.reject("手机号格式不正确");
    }else {
      return Promise.resolve(); //验证通过
    }
  }


  componentWillMount() {
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
  }

  render() {
    const cityArray = this.state.cityArray
    //用户注册成功,自动跳转到登录页面
    const { isRegisterSuccess } = this.state;
    if (isRegisterSuccess) {
      return <Redirect to="/login" />;
    }
    //const errorMsg = this.props.userData.errorMsg;
    return (
      <div>
        <div className="loginWrapper"></div>
        <div className="login">
          <header className="login-header">
            <h1>好味道</h1>
          </header>
          <section className="login-content">
            <h2>用户注册</h2>

            <Form
              name="normal_login"
              className="login-form"
              initialValues={{
                remember: true,
              }}
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
            >
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: "请输入用户名!",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  style={{ borderRadius: "5px" }}
                  placeholder="用户名"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {
                    validator: this.validatePwd,
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="密码"
                  style={{ borderRadius: "5px" }}
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                rules={[
                  {
                    validator: this.validatePwd,
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="确认密码"
                  style={{ borderRadius: "5px" }}
                />
              </Form.Item>

              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: "请输入姓名!",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  style={{ borderRadius: "5px" }}
                  placeholder="姓名"
                />
              </Form.Item>

              <Form.Item
                name="idType">
                <Select
                  placeholder="证件类型"
                  options={[
                    {
                      value:'0',
                      label:'身份证'
                    },
                    {
                      value:'1',
                      label:'护照'
                    },
                    {
                      value:'2',
                      label:'港澳通行证'
                    }
                  ]}>

                </Select>
              </Form.Item>
              
              <Form.Item
                name="id_number"
                rules={[
                  {
                    required: true,
                    message: "请输入证件号码",
                  },
                  {
                    validator: this.validateIdNumber,
                  },
                ]}
              >
                <Input
                  placeholder="证件号码"
                  style={{ borderRadius: "5px" }}
                />
              </Form.Item>

              <Form.Item
                name="place">
                <Cascader options={cityArray}  placeholder="请选择您所在城市">
                </Cascader>
              </Form.Item>
              <Form.Item
                name="phone_number"
                rules={[
                  {
                    required: true,
                    message: "请输入手机号",
                  },
                  {
                    validator: this.validatePhoneNumber,
                  },
                ]}
              >
                <Input
                  placeholder="手机号"
                  style={{ borderRadius: "5px" }}
                />
              </Form.Item>
              <Form.Item
                name="description"
                rules={[
                  {
                    required: true,
                    message: "请输入个人简介",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  style={{ borderRadius: "5px" }}
                  placeholder="个人简介"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  style={{ borderRadius: "5px" }}
                >
                  确认
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  className="login-form-button"
                  style={{ borderRadius: "5px" }}
                >
                  取消
                </Button>
              </Form.Item>
            </Form>
          </section>
        </div>
      </div>
    );
  }
}
export default connect((state) => ({}), {})(Register);
