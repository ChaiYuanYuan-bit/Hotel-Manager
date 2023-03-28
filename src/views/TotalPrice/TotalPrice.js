import React,{useRef,useEffect} from 'react';
import * as echarts from 'echarts';
import {$totalTypePrice} from '../../api/roomApi'
import './TotalPrice.scss'
const TotalPrice = () => {
    let refDiv = useRef()
    useEffect(() => {
        let myChart= echarts.getInstanceByDom(refDiv.current); //有的话就获取已有echarts实例的DOM节点。
        if (myChart== null) { // 如果不存在，就进行初始化。
            myChart= echarts.init(refDiv.current);
        }
        //获取销售数据
        $totalTypePrice().then(response=>{
            let roomtypeNames = response.map(r=>r.roomTypeName)
            let values = response.map(r=>r.totalMoney)
            // 绘制图表
            myChart.setOption({
                title: {
                text: '房间类型销售额统计',
                },
                grid:{
                    left:'5%',
                    width:'70%'
                },
                tooltip: {},
                xAxis: {
                data: roomtypeNames
                },
                yAxis: {},
                series: [
                {
                    name: '销量',
                    type: 'bar',
                    data:values
                }
                ]
            }); 
        })
    },[])

    return (
        <div className='charts' ref={refDiv}>
        </div>
    );
}

export default TotalPrice;
