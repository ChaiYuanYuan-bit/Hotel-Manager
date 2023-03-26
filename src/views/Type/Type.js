import React,{Fragment,useEffect,useState,ConfigProvider } from 'react';
import {Table,Button,Popconfirm } from 'antd'
import AddType from './AddType/AddType';
import{$typeList,$del} from '../../api/typeApi'
import MyNotification from '../../components/MyNotification';


const RoomType = () => {
   //角色列表
   let [typeList,setTypeList] = useState([])

   //通知框状态
   let [noteMsg,setNoteMsg] = useState({type:'',description:''})

   //抽屉状态
   let [open, setOpen] = useState(false);

   //编辑状态所选id
   let [typeId,setTypeId] = useState(0)

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
           let data = await $typeList()
           data = data.map(r=>({...r,key:r.id}))
           setTypeList(data)
       }
       catch(error){
           setNoteMsg({type:'error',description:'网络错误'})
       }
   }

   //删除房型
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

   //编辑房型
   const handleEdit =(id) => {
        setTypeId(id)//设置为编辑状态
        setOpen(true)
   }
   
   //表格列信息
   const columns = [
       {
           title: '房型编号',
           dataIndex: 'id',
           key: 'id',
           align:'center'
       },
       {
           title: '房型名称',
           dataIndex: 'typeName',
           key: 'typeName',
           align:'center'
       },
       {
        title: '房型价格',
        dataIndex: 'roomTypePrice',
        key: 'roomTypePrice',
        align:'center'
        },
        {
            title: '床位数量',
            dataIndex: 'bedNum',
            key: 'bedNumb',
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
           <Table  columns={columns} dataSource={typeList} />
           <AddType open={open} setOpen={setOpen} loadList={loadList} typeId={typeId} setTypeId={setTypeId}/>
           <MyNotification noteMsg = {noteMsg}/>
       </Fragment>
   );
}

export default RoomType;
