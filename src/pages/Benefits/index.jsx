import React, { Component } from 'react'
import { connect } from "react-redux";
import axios from 'axios';
import dayjs from 'dayjs';
import { DatePicker, Space, Cascader, Button, Table } from 'antd';
import getCityArray from "../../utils/getCityUtils";
const { Column, ColumnGroup } = Table;
const { RangePicker } = DatePicker;
//TODO:利润页面

class Benefits extends Component {
  state = {
    cityArray: [],
    benefitsData: [],
    datePair: [],
    selectCity: ''
  }


  //请求benefits_query
  getBenefits = () => {

  }

  componentWillMount() {
    //获取城市列表
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

    //
    // var dateStringNow = new Date()
    // var dateStringPast = new Date()
    // dateStringPast.setMonth(dateStringPast.getMonth()-3)
    const { userData } = this.props
    axios({
      url: '/our/admin/benefits_query',
      method: 'get',
      params: {
        city: userData.city
      }
    })
      .then(
        (res) => {
          this.setState({ benefitsData: res.data })
        }
      )
      .catch(
        (err) => {
          console.log(err)
          alert("网络错误")
        }
      )

  }


  render() {
    const { cityArray } = this.state
    return (
      <>
        <div>
          <RangePicker
            picker="month"
            onChange={(date, datePair) => {
              this.setState({ datePair: datePair })
            }} />
          <Cascader
            options={cityArray}
            placeholder="请选择您所要查看城市"
            onChange={(value) => {
              this.setState({ selectCity: value[0] + value[1] })
            }} />
          <Button
            onClick={this.getBenefits}>
            确认
          </Button>
        </div>
        <div>
          <Table
            bordered={true}>
            <ColumnGroup title="用户id">
              <Column title="寻味道用户id" dataIndex="userid_1" key="userid_1" />
              <Column title="请品鉴用户id" dataIndex="userid_2" key="userid_2" />
            </ColumnGroup>
            <Column title="味道类型" dataIndex="flavor_type" key="flavor_type" />
            <Column title="所在区域" dataIndex="city" key="city" />
            <Column title="中介收益" dataIndex="fee" key="fee" />
            <Column title="请求达成日期" dataIndex="finish_time" key="finish_time" />
          </Table>
        </div>
      </>
    )
  }
}

export default connect((state) => ({ userData: state.userData, }), {})(Benefits);
