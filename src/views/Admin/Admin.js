import React,{useState,useEffect} from 'react';
import { Table,Button,Popconfirm,Pagination,Select } from 'antd';
import {$accountList,$del} from '../../api/adminApi'
import{$roleList} from '../../api/roleApi'
import MyNotification from '../../components/MyNotification';
import AddAdmin from './AddAdmin/AddAdmin';

const Admin = () => {
    //账户列表数据
    let [adminList,setAdminList] = useState([])
    //角色列表
    let [roleList,setRoleList] = useState([])
    //通知框状态
    let [noteMsg,setNoteMsg] = useState({type:'',description:''})
    //抽屉状态
    let [open, setOpen] = useState(false);
    //编辑状态所选id
    let [loginId,setLoginId] = useState('')
    //编辑状态所选id
    let [roleId,setRoleId] = useState(0)
    //页码
    let [pageIndex,setPageIndex] = useState(1)
    //总数量
    let [count,setCount] = useState(1)

    //初始化加载状态
    useEffect(()=>{
        loadRoleList()
        loadAdminList()
    },[pageIndex,roleId])

    //加载角色下拉框
    const loadRoleList = async ()=>{
        try{
            let data = await $roleList()
            data = data.map(r=>({value:r.id,label:r.id+'\t'+r.roleName}))
            data.unshift({value:0,label:'全部角色'})
            setRoleList(data)
        }
        catch(error){
            setNoteMsg({type:'error',description:'网络错误'})
        }
    }

    //打开右边抽屉
    const showDrawer = () => {
        setOpen(true)//打开抽屉
    }

    //加载账户列表
    const loadAdminList = async ()=>{
        try{
            let roleData = await $roleList()
            let {data,count} = await $accountList({roleId,pageSize:8,pageIndex})
            data = data.map(r=>({...r,key:r.loginId,roleName:roleData[r.roleId-1].roleName}))
            //设置账户数据
            setAdminList(data)
            //设置总数量
            setCount(count)
        }
        catch(error){
            console.log('error', error)
            setNoteMsg({type:'error',description:'网络错误'})
        }
    }

    //编辑角色
    const handleEdit =(loginId) => {
        setLoginId(loginId)//设置为编辑状态
        setOpen(true)
    }

    //删除角色
    const del = async (id,photo) => {
      try{
        const {success,message} = await $del({id,photo})
        if(success)
        {
                setNoteMsg({type:'success',description:message})
                loadAdminList()
        }
        else{
                setNoteMsg({type:'error',description:message})
                loadAdminList()
        }
    }
    catch(error){
        setNoteMsg({type:'error',description:'网络错误'})
    }
    }
    

    //表格列信息
    const columns = [
    {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: '账号',
        dataIndex: 'loginId',
        key: 'loginId',
    },
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone',
    },
    {
        title: '头像',
        dataIndex: 'photo',
        align:'center',
        render:(ret)=>(
            <img 
            style={{width:'50px',height:'50px'}}  
            alt='photo' 
            src='https://tupian.qqw21.com/article/UploadPic/2019-4/201942420443049051.jpg'/>
        )
    },
    {
        title: '角色',
        align:'center',
        dataIndex: 'roleName',
        minwidth:'100px',
        // key: 'roleName',
    },
    {
        title: '操作',
        key: 'action',
        render: (ret) => (
            <>
                <Button onClick={()=>{handleEdit(ret.loginId)}} style={{margin:'5px 20px'}}  size="middle">编辑</Button>
                <Popconfirm
                title="提示"
                description="确定删除么?"
                onConfirm={()=>{del(ret.id,ret.photo)}}
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
                    <p style={{margin:0,padding:'auto,0', display:'inline-block'}}>角色：</p>
                    <Select 
                    options={roleList} 
                    style={{width:'150px',textAlign:'center'}} 
                    defaultValue={0}
                    onSelect = {value=>{setRoleId(value)}}
                    >
                    </Select>
                    <Button type='primary' style={{marginLeft:'20px'}}>查询</Button>
                    <Button onClick={showDrawer} style={{marginLeft:'20px'}}>添加</Button>
                </div>
                
            </div>

            <Table  
            columns={columns} 
            dataSource={adminList} 
            pagination={false}
            />

            <Pagination size='small' 
            defaultCurrent={pageIndex} 
            total={count} 
            pageSize={8} 
            onChange={(page)=>{setPageIndex(page)}}
            />

            <MyNotification noteMsg = {noteMsg}/>
            <AddAdmin 
            open={open} 
            setOpen={setOpen} 
            loadAdminList={loadAdminList} 
            loginId={loginId} 
            setLoginId={setLoginId}
            roleList = {roleList}
            />
        </>
    );
}

export default Admin;
