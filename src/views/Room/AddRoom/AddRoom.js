import React, {Fragment,useState,useEffect} from 'react';
import {Button,Drawer,Form,Input,Select } from 'antd'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {$getOne,$update,$add} from '../../../api/roomApi'
import {$listToUpdate,$stateList} from '../../../api/stateApi'

import MyNotification from '../../../components/MyNotification';


const AddRoom = ({open,setOpen,loadRoomList,roomTypeList,roomId,setRoomId}) => {
    //创建表单实例
    let[form] = Form.useForm()
    //通知框状态
    let [noteMsg,setNoteMsg] = useState({type:'',description:''})
    //客房状态
    let [roomStateList,setRoomStateList] = useState([])
    
    //关闭右边抽屉并清空表单
    const onClose = () => {
        setOpen(false)  //关闭抽屉
        setRoomId(0)   //取消编辑状态
        clear()  //清空表单
    };
    //编辑状态
    useEffect(()=>{
        if(roomId){
            $getOne(roomId).then(data=>{
                form.setFieldsValue({
                    ...data,
                    roomTypeName:data.roomType.typeName,
                    roomStateId:data.roomState.roomStateId,
                })
            })
            loadRoomState()
        }
        else{
            loadRoomNewState()
        }
    },[roomId])

    //加载客房状态下拉框
    const loadRoomState = async ()=>{
        try{
            let data = await $stateList()
            data = data.map(r=>({value:r.roomStateId,label:r.roomStateName}))
            setRoomStateList(data)
        }
        catch(error){
            console.log('error', error)
            setNoteMsg({type:'error',description:'网络错误'})
        }
    }

    const loadRoomNewState = async ()=>{
        try{
            let data = await $listToUpdate()
            data = data.map(r=>({value:r.roomStateId,label:r.roomStateName}))
            setRoomStateList(data)
        }
        catch(error){
            setNoteMsg({type:'error',description:'网络错误'})
        }
    }


    //表单提交的方法
    const onFinish = async (values) => {
        try{
            if(roomId>0)
            {
                //修改客房
                let {success,message} = await $update(values)
                console.log({success,message})
                if(success)
                {
                    setNoteMsg({type:'success',description:message})
                    loadRoomList()
                    setOpen(false)
                    setRoomId(0)   //取消编辑状态
                    form.resetFields()
                }
                else{
                    setNoteMsg({type:'error',description:message})
                    setRoomId(0)   //取消编辑状态
                    setOpen(false)
                }
            }
            else{
                //添加房型
                let {success,message} = await $add(values)
                if(success)
                {
                    setNoteMsg({type:'success',description:message})
                    setOpen(false)
                    clear()
                    loadRoomList()
                }
                else{
                    setNoteMsg({type:'error',description:message})
                    setOpen(false)
                }
            }
            
        }
        catch(error){
            setNoteMsg({type:'error',description:'网络错误'})
            setOpen(false)
        }
    }
    //清空表单
    const clear = () => {
      form.resetFields()
    }
    

    return (
        <Fragment>
            <Drawer 
            title={roomId>0 ? '修改客房':'添加客房'}
            placement="right" 
            onClose={onClose} 
            open={open} 
            width={600}>
                <Form
                name="basic"
                form={form}
                labelCol={{
                span: 4,
                }}
                wrapperCol={{
                span: 16,
                }}
                style={{
                maxWidth: 600,
                }}
                initialValues={{
                remember: true,
                }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                label="房间号"
                name="roomId"
                >
                <Input disabled={roomId>0?true:false}/>
                </Form.Item>

                <Form.Item 
                label="房型"
                name="roomTypeId"
                rules = {[
                    {
                        required: true,
                        message: '请选择客房类型',
                    }
                ]}
                >
                    <Select options={roomTypeList.slice(1)}></Select>
                </Form.Item>
                <Form.Item 
                label="状态"
                name="roomStateId"
                rules = {[
                    {
                        required: true,
                        message: '请选择客房状态',
                    }
                ]}
                >
                    <Select options={roomStateList}></Select>
                </Form.Item>
                <Button type='primary' style={{marginLeft:'90px'}} htmlType='submit'>{roomId>0 ? '修改':'添加'}</Button>
                <Button  onClick={onClose} style={{marginLeft:'10px'}}>取消</Button>
                </Form>
            </Drawer>
            <MyNotification noteMsg = {noteMsg}/>
        </Fragment>
    );
}

export default AddRoom;
