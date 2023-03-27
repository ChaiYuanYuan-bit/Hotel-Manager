import React,{useState,useEffect} from 'react';
import { Table,Button,Popconfirm,Pagination,Select,Tag, Input } from 'antd';
import {$guestList} from '../../api/guestApi'
import{$typeList} from '../../api/typeApi'
import{$stateList} from '../../api/guestApi'
import MyNotification from '../../components/MyNotification';
import AddGuest from './AddGuest/AddGuest';

const Guest = () => {
    //顾客列表数据
    let [guestList,setGuestList] = useState([])
    //顾客列表
    let [guestName,setGuestName] = useState('')
    //结账状态列表
    let [resideStateList,setResideStateList] = useState([])
    //通知框状态
    let [noteMsg,setNoteMsg] = useState({type:'',description:''})
    //抽屉状态
    let [open, setOpen] = useState(false);
    //筛选房型
    let [roomTypeList,setRoomTypeList] = useState([])
    //筛选顾客结账状态
    let [guestStateId,setGuestStateId] = useState(0)
    //顾客id
    let [guestId,setGuestId] = useState(0)
    //页码
    let [pageIndex,setPageIndex] = useState(1)
    //总数量
    let [count,setCount] = useState(1)

    //初始化加载状态
    useEffect(()=>{
        loadStateList()
        loadGuestList()
        loadRoomTypeList()
    },[pageIndex,guestStateId])
    //加载房型数据
    const loadRoomTypeList = async ()=>{
        try{
            let data = await $typeList()
            data = data.map(r=>({value:r.id,label:r.typeName}))
            setRoomTypeList(data)
        }
        catch(error){
            setNoteMsg({type:'error',description:'网络错误'})
        }
    }

     //结账状态下拉框
     const loadStateList = async () => {
        try{
            let data = await $stateList()
            data = data.map(r=>({value:r.resideStateId,label:r.resideStateName}))
            data.unshift({value:0,label:'请选择结账状态'})
            setResideStateList(data)
        }
        catch(error){
            setNoteMsg({type:'error',description:'网络错误'})
        }
     }

     //加载客房列表
    const loadGuestList = async ()=>{
        try{
            let {data,count} = await $guestList({pageSize:8,pageIndex,guestName,guestStateId})
            data = data.map(r=>({
                key:r.roomId,
                guestId:r.guestId,
                identityId:r.identityId,
                guestName:r.guestName,
                phone:r.phone,
                roomId:r.roomId,
                roomTypeName:r.room.roomType.typeName,
                roomTypePrice:r.room.roomType.roomTypePrice,
                bedNum:r.room.roomType.bedNum,
                resideDate:r.resideDate,
                leaveDate:r.leaveDate,
                deposit:r.deposit,
                totalMoney:r.totalMoney,
                guestNum:r.guestNum,
                resideStateName:r.resideState.resideStateName
                }))
            //设置账户数据
            setGuestList(data)
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
    const handleEdit =(guestId,resideStateName) => {
        if(resideStateName==="入住"){
            setNoteMsg({type:'error',description:'当前状态不可修改'})
        }
        else{
            setGuestId(guestId)//设置为编辑状态
            setOpen(true)
        }
    }

    //删除客房
    const del = async (roomId) => {
      try{
        const {success,message} = await $del(roomId)
        if(success)
        {
                setNoteMsg({type:'success',description:message})
                loadGuestList()
        }
        else{
                setNoteMsg({type:'error',description:message})
                loadGuestList()
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
        title: '顾客姓名',
        dataIndex: 'guestName',
        key: 'guestName',
        width:'7%',
        align:'center',
    },
    {
        title: '顾客电话',
        dataIndex: 'phone',
        key: 'phone',
        width:'8%',
        align:'center',
    },
    {
        title: '身份证号',
        dataIndex: 'identityId',
        key: 'identityId',
        width:'10%',
        align:'center',
    },
    {
        title: '房间号',
        dataIndex: 'roomId',
        key: 'roomId',
        width:'5%',
        align:'center',
    },
    {
        title: '房间类型',
        dataIndex: 'roomTypeName',
        key:'roomTypeName',
        width:'8%',
        align:'center',
    },
    {
        title: '房间价格',
        dataIndex: 'roomTypePrice',
        key:'roomTypePrice',
        width:'7%',
        align:'center',
    },
    {
        title: '床位数',
        dataIndex: 'bedNum',
        key:'bedNum',
        width:'5%',
        align:'center',
    },
    {
        title: '入住日期',
        dataIndex: 'resideDate',
        key:'resideDate',
        width:'10%',
        align:'center',
    },
    {
        title: '离开日期',
        dataIndex: 'leaveDate',
        width:'10%',
        key:'leaveDate',
        align:'center',
    },
    {
        title: '押金',
        dataIndex: 'deposit',
        align:'center',
        key:'deposit',
        width:'5%',
    },
    {
        title: '消费金额',
        dataIndex: 'totalMoney',
        key:'totalMoney',
        align:'center',
        width:'7%',
    },
    {
        title: '入住人数',
        dataIndex: 'guestNum',
        key:'guestNum',
        align:'center',
        width:'7%'
    },
    {
        title: '结账状态',
        dataIndex: 'resideStateName',
        width:'7%',
        key: 'tags',
        align:'center',
        render:((resideStateName)=>{return(
            <>
                <Tag color={resideStateName==="已结账"? 'green' : 'volcano'}>
                    {resideStateName}
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
            {ret.resideStateName==="已结账"? 
            <>
            <Button 
            onClick={()=>{handleEdit(ret.guestId,ret.resideStateName)}} 
            style={{margin:'5px',borderColor:'orange',color:'orange'}}  
            size="middle">
                编辑
            </Button>
            <Button 
            onClick={()=>{handleEdit(ret.guestId,ret.resideStateName)}} 
            style={{margin:'5px',borderColor:'lightseagreen',color:'lightseagreen'}}  
            size="middle">
                结账
            </Button>
            </>
             : 
            <Popconfirm
            title="提示"
            description="确定删除么?"
            onConfirm={()=>{del(ret.guestId)}}
            okText="确定"
            cancelText="取消"
            >
                <Button style={{margin:'5px',borderColor:'red',color:'red'}} size="middle">删除</Button>
            </Popconfirm>}
            </>
        ),
        align:'center'
        },
    ];

    return (
        <>
            <div className='search'>
                <div>
                    <p style={{margin:0,padding:'auto,0',display:'inline-block'}}>顾客姓名：</p>
                    <Input onChange={e=>setGuestName(e.target.value)} style={{margin:0,padding:'auto,0',width:'120px'}}/>
                    <Select 
                    options={resideStateList}
                    defaultValue={0} 
                    style={{width:'150px',textAlign:'center',marginLeft:'20px'}} 
                    onSelect = {value=>setGuestStateId(value)}
                    >
                    </Select>
                    <Button type='primary' onClick={()=>{setPageIndex(1);loadGuestList()}} style={{marginLeft:'20px'}}>搜索</Button>
                    <Button onClick={showDrawer} style={{marginLeft:'20px'}}>添加</Button>
                </div>
                
            </div>

            <Table  
            columns={columns} 
            dataSource={guestList} 
            pagination={false}
            />

            <Pagination size='small' 
            defaultCurrent={pageIndex} 
            total={count} 
            pageSize={8} 
            onChange={(page)=>{setPageIndex(page)}}
            />

            <MyNotification noteMsg = {noteMsg}/>
            <AddGuest 
            open={open} 
            setOpen={setOpen} 
            loadGuestList={loadGuestList} 
            guestId={guestId} 
            setGuestId={setGuestId}
            // roomStateList={roomStateList}
            roomTypeList = {roomTypeList}
            />
        </>
    );
}

export default Guest;
