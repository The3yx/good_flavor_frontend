import React, { Component} from 'react'
import { Button, Modal, Form, Input} from 'antd';
import { UserOutlined} from "@ant-design/icons";

//TODO:GoodFlavorModal需要接收props，从而构建UI
export default class GoodFlavorModal extends Component {
  render() {
    const {} = this.props
    return (
        <Modal
        visible={open}
        title="Title"
        onOk={()=>{
            
        }}
        onCancel={()=>{

        }}
        footer={[
            <Button key="back" onClick={()=>{}}>
                Return
            </Button>,
            <Button key="submit" type="primary" loading={false} onClick={()=>{}}>
                Submit
            </Button>,
            <Button
                key="link"
                href="https://google.com"
                type="primary"
                loading={false}
                onClick={()=>{}}
            >
                Search on Google
            </Button>,
        ]}
    >
        {/**Form表单的使用参见Form组件文档：搜索:Click or drag file to this area to upload */}
        <Form>
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
                        message: "最大10位",
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
        </Form>
        
        <p>test</p>
    </Modal>
    )
  }
}
