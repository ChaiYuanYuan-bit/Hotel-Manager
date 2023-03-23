import React,{useState,useEffect} from 'react';
import { Table,Button,Popconfirm,Image } from 'antd';
import {$list,$del} from '../../api/adminApi'
import MyNotification from '../../components/MyNotification';
import AddAdmin from './AddAdmin/AddAdmin';

const Admin = () => {
    //账户列表数据
    let [adminList,setAdminList] = useState([])
    //通知框状态
    let [noteMsg,setNoteMsg] = useState({type:'',description:''})
    //抽屉状态
    let [open, setOpen] = useState(false);
    //编辑状态所选id
    let [loginId,setLoginId] = useState('')

    //初始化加载状态
    useEffect(()=>{
        loadAdminList()
    },[])

    //打开右边抽屉
    const showDrawer = () => {
        setOpen(true)//打开抽屉
    }

    //加载账户列表
    const loadAdminList = async ()=>{
        try{
            let {data,count} = await $list()
            data = data.map(r=>({...r,key:r.loginId}))
            setAdminList(data)
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
        dataIndex: 'roleId',
        key: 'name',
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
                <Button onClick={showDrawer}>添加</Button>
            </div>
            <Table  columns={columns} dataSource={adminList} />
            <MyNotification noteMsg = {noteMsg}/>
            <AddAdmin 
            open={open} 
            setOpen={setOpen} 
            loadAdminList={loadAdminList} 
            loginId={loginId} 
            setLoginId={setLoginId}
            />
        </>
    );
}

export default Admin;
