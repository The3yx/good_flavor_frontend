/**
 * @author:shanmu
 * @time:2022.04.29
 */
import React, { Component } from "react";
//import logo from "../../assets/image/head.jpg";
import { Form, Input, Button, Cascader, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { NavLink, Redirect } from "react-router-dom";
import styles from "./index.less";
import { connect } from "react-redux";
import axios from 'axios';
import getCityArray from "../../utils/getCityUtils";


//TODO:所有的框都太长了
class Register extends Component {
  state = {
    isRegisterSuccess: false,
    cityArray: []
  }

  onFinish = async (values) => {
    console.log('call onFinish')
    const { username, password, confirmPassword } = values;
    if (password !== confirmPassword) {
      return alert("密码不一致")
    }

    axios.post(
      '/register',
      {
        username: username,
        password: password,
      }
    )
      .then(
        (res) => {
          console.log(res)
          const isRegisterSuccess = this.state.isRegisterSuccess
          //注册成功的提示
          this.setState({ isRegisterSuccess: !isRegisterSuccess })


          return alert("注册成功")
        },
        (err) => {
          console.log(err)

          return alert("注册失败")
        }
      )
      .catch(
        (err) => {
          console.log(err)
        }
      )
  };
  onFinishFailed = (values, errorFields, outOfDate) => {
    values.errorFields.map((x) => {
      return console.log(x.errors);
    });
  };
  validatePwd = (rule, value) => {
    //TODO:密码要求:1length>=6; 2.digital个数>=2; 2.包含大小写
    if (!value) {
      return Promise.reject("密码必须输入");
    } else if (value.length < 8) {
      return Promise.reject("密码不能小于8");
    } else if (value.length > 12) {
      return Promise.reject("密码不能大于12");
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return Promise.reject("密码必须由大小写字母或者数字组成");
    } else {
      return Promise.resolve(); //验证通过
    }
  };

  validateIdNumber = (rule, value) => {
    //TODO:证件号码的格式暂时只设定为数字组成即可
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
    }
  }

  onChangePlace = () =>{

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
          this.setState({cityArray:cityArray})
          
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
    //如果用户已经登陆,自动跳转到登录页面
    const { isRegisterSuccess } = this.state;
    if (isRegisterSuccess) {
      return <Redirect to="/login" />;
    }
    //const errorMsg = this.props.userData.errorMsg;
    return (
      <div>
        <div className={styles.testt}>test</div>
        <div className="loginWrapper"></div>
        <div className="login">
          <header className="login-header">
            {/*<img src={logo} alt="logo" />*/}
            {/** //TODO:好味道居中
              *   //TODO:
             */}
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
                initialValue="admin"
                rules={[
                  {
                    required: true,
                    message: "请输入用户名!",
                  },
                  {
                    min: 3,
                    message: "最小5位",
                  },
                  {
                    max: 15,
                    message: "最大15位",
                  },
                  {
                    pattern: /^[a-zA-Z0-9_]+$/,
                    message: "必须是英文,数字或下划线组成",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  style={{ borderRadius: "5px" }}
                  placeholder="用户名:wxy"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "请输入密码!",
                  },
                  {
                    validator: this.validatePwd,
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  //placeholder="密码:helishou"
                  style={{ borderRadius: "5px" }}
                />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                rules={[
                  {
                    required: true,
                    message: "请确认密码!",
                  },
                  {
                    validator: this.validatePwd,
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="密码:helishou"
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
                  placeholder="用户名:wxy"
                />
              </Form.Item>
              {/*TODO:证件类型选择*/}

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
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="密码:helishou"
                  style={{ borderRadius: "5px" }}
                />
              </Form.Item>
              <Form.Item
                name="place">
                  <Cascader options={cityArray} onChange={this.onChangePlace} placeholder="请选择您所在城市">

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
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="密码:helishou"
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
                  placeholder="用户名:wxy"
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
                <Button
                  type="primary"
                  htmlType="submit"
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
