import React,{Fragment,useEffect,useState} from 'react';
import {Table,Button,Space,Popconfirm,message } from 'antd'
import AddRole from './AddRole/AddRole';
import MyNotification from '../../components/MyNotification';
import {$list,$del} from '../../api/roleApi'

const Role = () => {
    //角色列表
    let [roleList,setRoleList] = useState([])

    //通知框状态
    let [noteMsg,setNoteMsg] = useState({type:'',description:''})

    //抽屉状态
    const [open, setOpen] = useState(false);

    //打开右边抽屉
    const showDrawer = () => {
        setOpen(true);
        };

    //初始化加载状态
    useEffect(()=>{
        loadList()
    },[])

    //获取列表
    const loadList = async ()=>{
        try{
            let data = await $list()
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
    
    //表格列信息
    const columns = [
        {
            title: '角色编号',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
            key: 'roleName',
        },
        {
            title: '操作',
            key: 'action',
            render: (ret) => (
                <>
                    <Popconfirm
                    title="提示"
                    description="确定删除么?"
                    onConfirm={()=>{del(ret.id)}}
                    okText="确定"
                    cancelText="取消"
                    >
                        <Space size="middle">
                            <a>删除</a>
                        </Space>
                    </Popconfirm>
                    
                </>
              
            ),
          },
        ];
    return (
        <Fragment>
            <div className='search'>
                <Button onClick={showDrawer}>添加</Button>
            </div>
            <Table columns={columns} dataSource={roleList} />
            <AddRole open={open} setOpen={setOpen} loadList={loadList}/>
            <MyNotification noteMsg = {noteMsg}/>
        </Fragment>
    );
}

export default Role;
