import React,{useState,useEffect} from 'react';
import { Table,Button,Popconfirm,Pagination,Select,Tag } from 'antd';
import {$roomList, $del} from '../../api/roomApi'
import{$typeList} from '../../api/typeApi'
import{$stateList} from '../../api/stateApi'
import MyNotification from '../../components/MyNotification';
import AddRoom from './AddRoom/AddRoom';

const Room = () => {
    //客房列表数据
    let [roomList,setRoomList] = useState([])
    //房型列表
    let [roomTypeList,setRoomTypeList] = useState([])
    //房型列表
    let [roomStateList,setRoomStateList] = useState([])
    //通知框状态
    let [noteMsg,setNoteMsg] = useState({type:'',description:''})
    //抽屉状态
    let [open, setOpen] = useState(false);
    //筛选房型
    let [roomTypeId,setRoomTypeId] = useState(0)
    //筛选客房状态
    let [roomStateId,setRoomStateId] = useState(0)
    //编辑状态id
    let [roomId,setRoomId] = useState('')
    //页码
    let [pageIndex,setPageIndex] = useState(1)
    //总数量
    let [count,setCount] = useState(1)

    //初始化加载状态
    useEffect(()=>{
        loadRoomTypeList()
        loadStateList()
        loadRoomList()
    },[pageIndex,roomTypeId,roomStateId])

    //房型下拉框
    const loadRoomTypeList = async ()=>{
        try{
            let data = await $typeList()
            data = data.map(r=>({value:r.id,label:r.typeName}))
            data.unshift({value:0,label:'全部房型'})
            setRoomTypeList(data)
        }
        catch(error){
            setNoteMsg({type:'error',description:'网络错误'})
        }
    }

     //客房状态下拉框
     const loadStateList = async () => {
        try{
            let data = await $stateList()
            data = data.map(r=>({value:r.roomStateId,label:r.roomStateName}))
            data.unshift({value:0,label:'全部状态'})
            setRoomStateList(data)
        }
        catch(error){
            setNoteMsg({type:'error',description:'网络错误'})
        }
     }

     //加载客房列表
    const loadRoomList = async ()=>{
        try{
            let {data,count} = await $roomList({roomTypeId,roomStateId,pageSize:8,pageIndex})
            data = data.map(r=>({
                ...r,
                key:r.roomId,
                roomTypeName:r.roomType.typeName,
                roomTypePrice:r.roomType.roomTypePrice,
                bedNum:r.roomType.bedNum,
                roomStateName:r.roomState.roomStateName
                }))
            //设置账户数据
            setRoomList(data)
            //设置总数量
            setCount(count)
        }
        catch(error){
            console.log('error', error)
            setNoteMsg({type:'error',description:'网络错误'})
        }
    }

    //打开右边抽屉
    const showDrawer = () => {
        setOpen(true)//打开抽屉
    }

    //编辑角色
    const handleEdit =(roomId,roomStateName) => {
        if(roomStateName==="入住"){
            setNoteMsg({type:'error',description:'当前状态不可修改'})
        }
        else{
            setRoomId(roomId)//设置为编辑状态
            setOpen(true)
        }
    }

    //删除客房
    const del = async (roomId,roomStateName) => {
      try{
        if(roomStateName==="入住")
        {
            setNoteMsg({type:'error',description:'当前状态不可删除'})
        }
        else{
            const {success,message} = await $del(roomId)
            if(success)
            {
                    setNoteMsg({type:'success',description:message})
                    loadRoomList()
            }
            else{
                    setNoteMsg({type:'error',description:message})
                    loadRoomList()
            }
        }
    }
    catch(error){
        console.log('error', error)
        setNoteMsg({type:'error',description:'网络错误'})
    }
    }
    
    //表格列信息
    const columns = [
    {
        title: '房间号',
        width:'10%',
        dataIndex: 'roomId',
        key: 'roomId',
        align:'center'
    },
    {
        title: '房型',
        width:'20%',
        dataIndex: 'roomTypeName',
        key: 'roomTypeName',
        align:'center'
    },
    {
        title: '房间价格',
        width:'20%',
        dataIndex: 'roomTypePrice',
        key: 'roomTypePrice',
        align:'center'
    },
    {
        title: '床位数',
        width:'10%',
        dataIndex: 'bedNum',
        align:'center',
    },
    {
        title: '房间状态',
        width:'10%',
        dataIndex: 'roomStateName',
        key: 'tags',
        align:'center',
        render:((roomStateName)=>{return(
            <>
                <Tag color={roomStateName==="空闲"? 'green' :
                roomStateName==='入住'?'volcano':'geekblue'}>
                    {roomStateName}
                </Tag>
            </>
        )})
    },
    {
        title: '操作',
        key: 'action',
        width:'10%',
        render: (ret) => (
            <>
                <Button onClick={()=>{handleEdit(ret.roomId,ret.roomStateName)}} style={{margin:'5px 20px'}}  size="middle">编辑</Button>
                <Popconfirm
                title="提示"
                description="确定删除么?"
                onConfirm={()=>{del(ret.roomId,ret.roomStateName)}}
                okText="确定"
                cancelText="取消"
                >
                    <Button danger size="middle">删除</Button>
                </Popconfirm>
            </>
        ),
        align:'center'
        },
    ];

    return (
        <>
            <div className='search'>
                <div>
                    <p style={{margin:0,padding:'auto,0', display:'inline-block'}}>房型：</p>
                    <Select 
                    options={roomTypeList} 
                    style={{width:'150px',textAlign:'center'}} 
                    defaultActiveFirstOption
                    defaultValue={{value:0,label:'全部房型'}}
                    onSelect = {value=>{setRoomTypeId(value)}}
                    >
                    </Select>
                    <Select 
                    options={roomStateList} 
                    style={{width:'150px',textAlign:'center',marginLeft:'20px'}} 
                    defaultActiveFirstOption
                    defaultValue={{value:0,label:'全部状态'}}
                    onSelect = {value=>{setRoomStateId(value)}}
                    >
                    </Select>
                    {/* <Button type='primary' style={{marginLeft:'20px'}}>查询</Button> */}
                    <Button onClick={showDrawer} style={{marginLeft:'20px'}}>添加</Button>
                </div>
                
            </div>

            <Table  
            columns={columns} 
            dataSource={roomList} 
            pagination={false}
            />

            <Pagination size='small' 
            style={{
                marginTop:'10px'
            }}
            defaultCurrent={pageIndex} 
            total={count} 
            pageSize={8} 
            onChange={(page)=>{setPageIndex(page)}}
            />

            <MyNotification noteMsg = {noteMsg}/>
            <AddRoom 
            open={open} 
            setOpen={setOpen} 
            loadRoomList={loadRoomList} 
            roomId={roomId} 
            setRoomId={setRoomId}
            roomStateList={roomStateList}
            roomTypeList = {roomTypeList}
            />
        </>
    );
}

export default Room;
