import React,{Fragment,useEffect,useState,ConfigProvider } from 'react';
import {Table,Button,Popconfirm } from 'antd'
import AddRole from './AddRole/AddRole';
import MyNotification from '../../components/MyNotification';
import {$roleList,$del} from '../../api/roleApi'

const Role = () => {
    //角色列表
    let [roleList,setRoleList] = useState([])

    //通知框状态
    let [noteMsg,setNoteMsg] = useState({type:'',description:''})

    //抽屉状态
    let [open, setOpen] = useState(false);

    //编辑状态所选id
    let [roleId,setRoleId] = useState(-1)

    //打开右边抽屉
    const showDrawer = () => {
        setOpen(true)//打开抽屉
        }

    //初始化加载状态
    useEffect(()=>{
        loadList()
    },[])

    //获取列表
    const loadList = async ()=>{
        try{
            let data = await $roleList()
            data = data.map(r=>({...r,key:r.id}))
            setRoleList(data)
        }
        catch(error){
            setNoteMsg({type:'error',description:'网络错误'})
        }
    }

    //删除角色
    const del = async (id) => {
        try{
            const {success,message} = await $del(id)
            if(success)
            {
                    setNoteMsg({type:'success',description:message})
                    loadList()
            }
            else{
                    setNoteMsg({type:'error',description:message})
                    loadList()
            }
        }
        catch(error){
            setNoteMsg({type:'error',description:'网络错误'})
        }
    }

    //编辑角色
    const handleEdit =(id) => {
        setRoleId(id)//设置为编辑状态
        setOpen(true)
    }
    
    //表格列信息
    const columns = [
        {
            title: '角色编号',
            dataIndex: 'id',
            key: 'id',
            align:'center'
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
            key: 'roleName',
            align:'center'
        },
        {
            title: '操作',
            key: 'action',
            render: (ret) => (
                <>
                    <Button onClick={()=>{handleEdit(ret.id)}} style={{marginRight:'20px'}}  size="middle">编辑</Button>
                    <Popconfirm
                    title="提示"
                    description="确定删除么?"
                    onConfirm={()=>{del(ret.id)}}
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
        <Fragment>
            <div className='search'>
                <Button onClick={showDrawer}>添加</Button>
            </div>
            <Table  columns={columns} dataSource={roleList} />
            <AddRole open={open} setOpen={setOpen} loadList={loadList} roleId={roleId} setRoleId={setRoleId}/>
            <MyNotification noteMsg = {noteMsg}/>
        </Fragment>
    );
}

export default Role;
