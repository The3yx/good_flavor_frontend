import React, { Component } from 'react'
import { connect } from "react-redux";
import axios from 'axios';
import dayjs from 'dayjs';
import { DatePicker, Space, Cascader, Button, Table, message } from 'antd';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';
import getCityArray from "../../utils/getCityUtils";
const { Column, ColumnGroup } = Table;
const { RangePicker } = DatePicker;

class Benefits extends Component {
  state = {
    cityArray: [],
    benefitsData: [],
    datePair: [],
    selectCity: this.props.userData.city,
    echartsDataX: [],
    echartsDataFee: []
  }


  //请求benefits_query
  getBenefits = () => {
    const {selectCity, datePair} = this.state
    var params = {city:selectCity}
    if (datePair.length !== 0){
      params.start_time=dayjs(datePair[0]).format('YYYY-MM-DD')
      params.stop_time=dayjs(datePair[1]).format('YYYY-MM-DD')
    }
    console.log(params)
    axios({
      url: '/our/admin/benefits_query',
      method: 'get',
      params: params
    })
      .then(
        (res) => {
          const data = res.data.map((value, index) => {
            return { ...value, fee: value.fee1 + value.fee2 }
          })
          const {echartsDataX, echartsDataFee} = this.constructEchartsData(data)

          this.setState({ benefitsData: data, echartsDataX:echartsDataX, echartsDataFee:echartsDataFee })

        }
      )
      .catch(
        (err) => {
          console.log(err)
          message.error("网络错误")
        }
      )

  }

  constructEchartsData (data){
    const newData = data.map((value,index)=>{
      return {
        finish_time:value.finish_time.substring(0,value.finish_time.length-3),
        fee:value.fee,
      }
    })

    const newMap = new Map()
    newData.forEach((e)=>{
      const k = e['finish_time']
      newMap.set(k,(newMap.get(k)||0)+Number(e['fee']))
    })

    //Note:sort方法是根据返回值与0的大小关系判断的
    const sortArr = [...newMap].sort((a,b)=>{
      if(a[0]>b[0])
        return 1
      else
        return -1
    })
    const Xdata = []
    const Ydata = []
    for(let item of sortArr){
      Xdata.push(item[0])
      Ydata.push(item[1])
    }
    return {echartsDataX:Xdata, echartsDataFee:Ydata}
  }

  echartsOption=() =>({
    legend: {},
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        lineStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: `rgba(255,0,255,.8)` },
            { offset: 1, color: `rgba(255,0,0,.8)` },
          ]),
          width: 5,
        }
      }
    },
    toolbox: {
      feature: {
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    xAxis: [
      {
        type: 'category',
        data: this.state.echartsDataX,
        boundaryGap: false,
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '中介费用/元'
      }
    ],
    series: [
      {
        name: '中介费用',
        data: this.state.echartsDataFee,
        type: 'line',
        yAxisIndex: 0,
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `rgba(255,0,255,.8)` },
              { offset: 1, color: `rgba(0,255,0,.8)` },
            ]),
          },
        },
        lineStyle: {
          width: 5,
        },
        areaStyle: {
          normal: {
            opacity: 0.1,
          }
        }
      }
    ]
  })

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
          const data = res.data.map((value, index) => {
            return { ...value, fee: value.fee1 + value.fee2 }
          })
          const {echartsDataX, echartsDataFee} = this.constructEchartsData(data)

          this.setState({ benefitsData: data, echartsDataX:echartsDataX, echartsDataFee:echartsDataFee })

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
    const { cityArray, benefitsData } = this.state
    return (
      <>
        <div>
          <RangePicker
            picker="month"
            onChange={(date, datePair) => {
              this.setState({ datePair: datePair })
            }} />
          <Cascader
            allowClear={false}
            defaultValue={['陕西省','西安市']}
            options={cityArray}
            placeholder="请选择您所要查看城市"
            onChange={(value) => {
              if(value)
                this.setState({ selectCity: value[0] + value[1] })
            }} />
          <Button
            onClick={this.getBenefits}>
            确认
          </Button>
        </div>
        <div>
          <Table
            dataSource={benefitsData}
            bordered={true}>
            <ColumnGroup title="用户id">
              <Column title="寻味道用户id" dataIndex="user1_id" key="userid_1" />
              <Column title="请品鉴用户id" dataIndex="user2_id" key="userid_2" />
            </ColumnGroup>
            <Column title="味道类型" dataIndex="flavor_type" key="flavor_type" />
            <Column title="所在区域" dataIndex="city" key="city" />
            <Column title="中介收益" dataIndex="fee" key="fee" />
            <Column title="请求达成日期" dataIndex="finish_time" key="finish_time" />
          </Table>
        </div>
        <div>
          <ReactEcharts option={this.echartsOption()}></ReactEcharts>
        </div>
      </>
    )
  }
}

export default connect((state) => ({ userData: state.userData, }), {})(Benefits);
