import React, { Component } from 'react'
import { connect } from "react-redux";
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import { Link, Route, Switch, Redirect } from 'react-router-dom'
import { Layout, Menu, Breadcrumb } from 'antd';

import Login from '../Login';
import UserInfo from '../UserInfo'
import MyGoodFlavor from '../MyGoodFlavor';
import MyTaste from '../MyTaste';
import GoodFlavorHall from '../GoodFlavorHall';
import AllUser from '../AllUser'
import GoodFlavor from '../GoodFlavor'
import Taste from '../Taste'
import AllFlavor from '../AllFlavor';
import AllTaste from '../AllTaste';
import Benefits from '../Benefits';
import './index.css'

const { SubMenu } = Menu;
const { Header, Content, Sider,Footer } = Layout;

//TODO:缺少退出logout
class Admin extends Component {
  render() {
    //get the userdata in local storage
    const userData = this.props.userData
    console.log(userData)
    //userdata is {}, ==> <Login/>
    if (!userData.access_token) {
      return <Redirect to='/login' />
    }

    //userdata isn't {}, ==> <Admin/>
    return (
      <div>
        <Layout style={{ height: "100%", width: "100%" }}>
          <Sider
            style={{
              overflow: "auto",
              height: "100vh",
              position: "fixed",
              left: 0,
            }}
          >
            {/* 设置固定侧边栏 */}
            <div>
              {/**note:如果这里写
               * <Link to="/admin" className="left-nav-header">
               * 那么在当前页面还存在的情况下,进行路由匹配,
               * /admin会匹配到Admin组件,然后默认Redircet到userinfo,但是
               * 这样侧边菜单栏并不会刷新(相当于进行的还是二级路由匹配)
               */}
              <Link to="/" className="left-nav-header">
                <h1>好味道</h1>
              </Link>
              <Menu
                theme='dark'
                style={{ width: 200 }}
                //TODO:defaultOpenKeys和defaultSelectedKeys不能写死,参见谷粒商城
                //这个小问题, 不影响, 可改可不改
                defaultOpenKeys={['sub1']}
                defaultSelectedKeys={['/userinfo']}
                mode="inline">
                <SubMenu key="sub1" icon={<NotificationOutlined />} title="个人主页">
                  <Menu.Item key="/userinfo"><Link to="/admin/userinfo">我的信息</Link></Menu.Item>
                  <Menu.Item key="/mygoodflavor"><Link to="/admin/mygoodflavor">我的寻味道</Link></Menu.Item>
                  <Menu.Item key="/mytaste"><Link to="/admin/mytaste">我的请品鉴</Link></Menu.Item>
                </SubMenu>
                <Menu.Item key="/goodflavorhall"><Link to="/admin/goodflavorhall">寻味道大厅</Link></Menu.Item>
                {/**style={{ display: userData.is_admin == true ? 'block' : 'none' }} */}
                <SubMenu key="sub2" icon={<NotificationOutlined />} title="管理员选项">
                  <Menu.Item key="/alluser"><Link to="/admin/alluser">用户信息</Link></Menu.Item>
                  <Menu.Item key="/goodflavor"><Link to="/admin/allflavor">寻味道</Link></Menu.Item>
                  <Menu.Item key="/taste"><Link to="/admin/alltaste">请品鉴</Link></Menu.Item>
                  <Menu.Item key="/benefits"><Link to="/admin/benefits">利润报表</Link></Menu.Item>
                </SubMenu>
                
              </Menu>
            </div>
          </Sider>
          <Layout style={{ marginLeft: 200 }}>
            <Header>Header</Header>
            <Content style={{ margin: 20, backgroundColor: "white" }}>
              <Switch>
                {/**register the route here */}
                <Route path="/admin/userinfo" component={UserInfo} />
                <Route path="/admin/mygoodflavor" component={MyGoodFlavor} />
                <Route path="/admin/mytaste" component={MyTaste} />
                <Route path="/admin/goodflavorhall" component={GoodFlavorHall} />
                <Route path="/admin/alluser" component={AllUser}/>
                <Route path="/admin/alltaste" component={AllTaste}/>
                <Route path="/admin/allflavor" component={AllFlavor}/>
                <Route path="/admin/benefits" component={Benefits}/>
                <Redirect to="/admin/userinfo" />
                {/* exact={true} from="/admin"  */}
              </Switch>
            </Content>
            <Footer style={{ textAlign: "center" }}>
              推荐使用edge浏览器, 来获得更佳操作体验
            </Footer>
          </Layout>
        </Layout>
     </div>
    )
  }
}


export default connect((state) => ({ userData: state.userData }), {})(Admin);