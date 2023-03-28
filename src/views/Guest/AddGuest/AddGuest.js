import React, {Fragment,useState,useEffect} from 'react';
import {Button,Drawer,Form,Input,Select,DatePicker } from 'antd'
import 'react-quill/dist/quill.snow.css';
import {$remainRoomList} from '../../../api/roomApi'
import { $add,$getOne,$update } from "../../../api/guestApi";
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/en_US';

import MyNotification from '../../../components/MyNotification';


const AddGuest = ({open,setOpen,loadGuestList,roomTypeList,guestId,setGuestId}) => {
    //创建表单实例
    let[form] = Form.useForm()
    //通知框状态
    let [noteMsg,setNoteMsg] = useState({type:'',description:''})
    //可选房间列表
    let [roomRemainList,setRoomRemainList] = useState([])
    //所选房型Id
    let [roomTypeId,setRoomTypeId] = useState(1)
    
    //关闭右边抽屉并清空表单
    const onClose = () => {
        clear()  //清空表单
        setOpen(false)  //关闭抽屉
        setGuestId(0)   //取消编辑状态
    };
    //编辑状态
    useEffect(()=>{
        if(guestId>0){
            $getOne(guestId).then(response=>{
                form.setFieldsValue({
                    ...response.data,
                    resideDate:dayjs(response.data.resideDate),
                    leaveDate:dayjs(response.data.leaveDate)
                })
            })
        }
    },[guestId])

    //加载可选客房
    const loadRemainRoom = async()=>{
        try {
            let data = await $remainRoomList({roomTypeId})
            if(data.length>0)
            {
                data = data.map(r=>({value:r.roomId,label:r.roomId}))
            }
            else{
                form.setFieldValue('roomId','')
            }
            setRoomRemainList(data)
        } catch (error) {
            console.log('error', error)
            setNoteMsg({type:'error',description:'网络错误'})
        }
    }

    //表单提交的方法
    const onFinish = async (values) => {
        try{
            if(guestId>0)
            {
                console.log('values', values)
                //修改顾客信息
                let {success,message} = await $update({
                    id:guestId,
                    guestName:values.guestName,
                    identityId:values.identityId,
                    phone:values.phone,
                    roomId:values.roomId,
                    resideDate:values.resideDate.format("YYYY/MM/DD HH:mm:ss"),
                    leaveDate:values.leaveDate.format("YYYY/MM/DD HH:mm:ss"),
                    deposit:values.deposit,
                    guestNum:values.guestNum,
                    totalMoney:values.totalMoney
                })
                if(success)
                {
                    setNoteMsg({type:'success',description:message})
                    loadGuestList()
                    setOpen(false)
                    setGuestId(0)   //取消编辑状态
                    form.resetFields()
                }
                else{
                    setNoteMsg({type:'error',description:message})
                    setGuestId(0)   //取消编辑状态
                    setOpen(false)
                }
            }
            else{
                //顾客入住
                let {success,message} = await $add(
                    {
                    ...values,
                    resideDate:values.resideDate.format("YYYY/MM/DD HH:mm:ss" ),
                    leaveDate:values.leaveDate.format("YYYY/MM/DD HH:mm:ss" )
                })
                if(success)
                {
                    setNoteMsg({type:'success',description:message})
                    setOpen(false)
                    clear()
                    loadGuestList()
                }
                else{
                    setNoteMsg({type:'error',description:message})
                    setOpen(false)
                    clear()
                }   
            }
        }
        catch(error){
            console.log('error', error)
            setNoteMsg({type:'error',description:'网络错误'})
            setOpen(false)
            clear()
        }
    }
    //清空表单
    const clear = () => {
      form.resetFields()
    }
    

    return (
        <Fragment>
            <Drawer 
            title={guestId>0 ? '修改':'添加'}
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
                roomTypeId:1
                }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                label="顾客姓名"
                name="guestName"
                rules = {[
                    {
                        required: true,
                        message: '请输入顾客姓名',
                    }
                ]}
                >
                <Input/>
                </Form.Item>
                <Form.Item 
                label="身份证号"
                name="identityId"
                rules = {[
                    {
                        required: true,
                        message: '请输入身份证号',
                    }
                ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item 
                label="手机号"
                name="phone"
                
                rules = {[
                    {
                        required: true,
                        message: '请输入手机号',
                    }
                ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item 
                label="房型"
                name="roomTypeId"
                rules = {[
                    {
                        required: true,
                        message: '请选择房型',
                    }
                ]}
                >
                    <Select 
                    options={roomTypeList}
                    onClick={()=>{loadRemainRoom()}}
                    onChange={value=>setRoomTypeId(value)}
                    ></Select>
                </Form.Item>
                <Form.Item 
                label="房间"
                name="roomId"
                rules = {[
                    {
                        required: true,
                        message: '请选择房间',
                    }
                ]}
                >
                <Select 
                disabled={roomRemainList.length>0?false:true}
                options={roomRemainList}
                title={roomRemainList.length>0?'':'暂无剩余房间'}
                ></Select>
                </Form.Item>
                <Form.Item 
                label="入住日期"
                name="resideDate"
                rules = {[
                    {
                        required: true,
                        message: '请选择入住日期',
                    }
                ]}
                >
                     <DatePicker
                      showTime 
                      showNow={true}
                      format="YYYY/MM/DD HH:mm:ss" 
                      locale={locale}
                      />
                </Form.Item>
                <Form.Item 
                label="离开日期"
                name="leaveDate"
                rules = {[
                    {
                        required: true,
                        message: '请选择离开日期',
                    }
                ]}
                >
                    <DatePicker 
                    showTime 
                    showNow={true}
                    format="YYYY/MM/DD HH:mm:ss" 
                    locale={locale}
                   />
                </Form.Item>
                <Form.Item 
                label="押金"
                name="deposit"
                rules = {[
                    {
                        required: true,
                        message: '请输入押金',
                    }
                ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item 
                label="入住人数"
                name="guestNum"
                rules = {[
                    {
                        required: true,
                        message: '请输入入住人数',
                    }
                ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item 
                label="总金额"
                name="totalMoney"
                rules = {[
                    {
                        required: true,
                        message: '请输入总金额',
                    }
                ]}
                >
                    <Input/>
                </Form.Item>
                <Button type='primary' style={{marginLeft:'90px'}} htmlType='submit'>{guestId>0 ? '修改':'添加'}</Button>
                <Button  onClick={onClose} style={{marginLeft:'10px'}}>取消</Button>
                </Form>
            </Drawer>
            <MyNotification noteMsg = {noteMsg}/>
        </Fragment>
    );
}

export default AddGuest;
