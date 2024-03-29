/**
 * @author:shanmu
 * @time:2022.04.06
 */
import React, { Component } from "react";
//import logo from "../../assets/image/head.jpg";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { NavLink, Redirect } from "react-router-dom";
import "./index.css";
import { connect } from "react-redux";
import { login, getAllUser } from "../../redux/actions";

class Login extends Component {
  state = {
    redirectRegister: false
  }
  onFinish = async (values) => {
    console.log('call onFinish')
    const { username, password } = values;

    //调用异步请求，
    this.props.login(username, password);

  };
  onFinishFailed = (values, errorFields, outOfDate) => {
    values.errorFields.map((x) => {
      return alert(x.errors);
    });
  };

  validatePwd = (rule, value) => {
    if (!value) {
      return Promise.reject("请输入密码");
    } else {
      return Promise.resolve(); //验证通过
    }
  };

  render() {

    //redirect to <Register/>
    const {redirectRegister} = this.state
    if(redirectRegister){
      return <Redirect to="/login"/>
    }

    //have logined ==> <Admin/>
    const userData = this.props.userData;
    const { history } = this.props

    if (userData.access_token) {
      return <Redirect to="/admin" />;
    }
    const errorMsg = this.props.userData.errorMsg;
    return (
      <div>
        <div className="loginWrapper"></div>
        <div className="login">
          <header className="login-header">
            {/*<img src={logo} alt="logo" />*/}
            <h1>好味道</h1>
          </header>
          <section className="login-content">
            <h2>用户登录</h2>

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

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  style={{ borderRadius: "5px" }}
                >
                  登录
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  className="login-form-button"
                  style={{ borderRadius: "5px" }}
                  onClick={() => {
                    history.push('/register')
                  }}
                >
                  注册
                </Button>
              </Form.Item>
            </Form>
          </section>
        </div>
      </div>
    );
  }
}
export default connect((state) => ({ userData: state.userData }), { login, getAllUser })(Login);
