import React, { Component } from 'react'
import { connect } from "react-redux";
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import { Link, Route, Switch, Redirect } from 'react-router-dom'
import { Layout, Menu, Breadcrumb } from 'antd';

import Login from '../Login';
import UserInfo from '../UserInfo'
import MyGoodFlavor from '../MyGoodFlavor';
import MyTaste from '../MyTaste';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

class Admin extends Component {
  render() {
    //get the userdata in local storage
    const userData = this.props.userData

    //userdata is {}, ==> <Login/>
    // if (!userData.access_token) {
    //   return <Redirect to='/login' />
    // }

    //userdata isn't {}, ==> <Admin/>
    return (
      <div>
        <Layout>
          <Header className="header">
            <div className="logo" />
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1',]}>
              <Menu.Item key="1">好味道</Menu.Item>
            </Menu>
          </Header>
          <Layout>
            <Sider width={200} className="site-layout-background">
              <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                style={{ height: '100%', borderRight: 0 }}
              >
                {/* <Menu.Item key="/serverconnection"><Link to="/admin/serverconnection">数据库配置</Link></Menu.Item>
                <Menu.Item key="/person" style={{ display: userData.is_admin == true ? 'block' : 'none' }} ><Link to="/person">用户管理</Link></Menu.Item> */}
                <SubMenu key="sub3" icon={<NotificationOutlined />} title="个人主页">
                  <Menu.Item key="/userinfo"><Link to="/admin/userinfo">我的信息</Link></Menu.Item>
                  <Menu.Item key="/mygoodflavor"><Link to="/admin/mygoodflavor">我的寻味道</Link></Menu.Item>
                  <Menu.Item key="/mytaste"><Link to="/admin/mytaste">我的请品鉴</Link></Menu.Item>
                </SubMenu>
                <SubMenu key="sub4" icon={<NotificationOutlined />} title="寻味道大厅">
                  <Menu.Item key="/community"><Link to="/admin/community">小区配置信息查询</Link></Menu.Item>
                  <Menu.Item key="/enodeb"><Link to="/admin/enodeb">基站eNodeB信息查询</Link></Menu.Item>
                  <Menu.Item key="/kpi"><Link to="/admin/kpi">小区KPI指标信息查询</Link></Menu.Item>
                  <Menu.Item key="/prb"><Link to="/admin/prb">PRB信息统计与查询</Link></Menu.Item>
                </SubMenu>
                <SubMenu key="sub5" icon={<NotificationOutlined />} title="业务分析">
                  <Menu.Item key="/C2INew"><Link to="/admin/C2INew">主邻小区干扰分析</Link></Menu.Item>
                  <Menu.Item key="/C2I3"><Link to="/admin/C2I3">重叠覆盖干扰小区三元组分析</Link></Menu.Item>
                  <Menu.Item key="/Mro"><Link to="/admin/Mro">Mro解析</Link></Menu.Item>
                  <Menu.Item key="/Nisd"><Link to="/admin/Nisd">网络干扰结构分析</Link></Menu.Item>
                </SubMenu>
              </Menu>
            </Sider>
            <Layout style={{ padding: '0 24px 24px' }}>
              <Content
                className="site-layout-background"
                style={{
                  marginTop: 24,
                  padding: 24,
                  minHeight: 736
                }}
              >
                <Switch>
                  {/**register the route here */}
                  <Redirect exact={true} from="/admin" to="/admin/userinfo" />
                  <Route path="/admin/userinfo" component={UserInfo} />
                  <Route path="/admin/mygoodflavor" component={MyGoodFlavor} />
                  <Route path="/admin/mytaste" component={MyTaste} />

                </Switch>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </div>
    )
  }
}


export default connect((state) => ({ userData: state.userData }), {})(Admin);