import React, { Component} from 'react'
import { Button, Modal, Form, Input} from 'antd';
import { Table, Tag, Space } from 'antd';
import { UserOutlined} from "@ant-design/icons";
import axios from 'axios';

const { Column, ColumnGroup } = Table;

export default class MyGoodFlavor extends Component {
    state = {
        GoodFlavorData: [
            //test data
            {
                key: '1',
                firstName: 'John',
                lastName: 'Brown',
                age: 32,
                address: 'New York No. 1 Lake Park',
                tags: ['nice', 'developer'],
            },
            {
                key: '2',
                firstName: 'Jim',
                lastName: 'Green',
                age: 42,
                address: 'London No. 1 Lake Park',
                tags: ['loser'],
            },
        ],
        open: false
    }

    testFunc = () => {
        const open = this.state.open
        this.setState({open:!open})
    }

    
    render() {
        const open = this.state.open
        return (
            <>
                <Table dataSource={this.state.MyGoodFlavor}>
                    <ColumnGroup title="Name">
                        <Column title="First Name" dataIndex="firstName" key="firstName" />
                        <Column title="Last Name" dataIndex="lastName" key="lastName" />
                    </ColumnGroup>
                    <Column title="Age" dataIndex="age" key="age" />
                    <Column title="Address" dataIndex="address" key="address" />
                    <Column
                        title="Tags"
                        dataIndex="tags"
                        key="tags"
                        render={(tags) => (
                            <>
                                {tags.map((tag) => (
                                    <Tag color="blue" key={tag}>
                                        {tag}
                                    </Tag>
                                ))}
                            </>
                        )}
                    />
                    <Column
                        title="Action"
                        key="action"
                        render={(_, record) => (
                            <Space size="middle">
                                <a onClick={this.testFunc}>Invite {record.lastName}</a>
                                <a>Delete</a>
                            </Space>
                        )}
                    />
                </Table>
                <Button onClick={this.testFunc}>
                    test
                </Button>
                
            </>
        )
    }
}
