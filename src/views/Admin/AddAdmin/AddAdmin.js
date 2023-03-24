import React, {Fragment,useState,useEffect} from 'react';
import {Button,Drawer,Form,Input,Select } from 'antd'
import {$add,$getOne,$update} from '../../../api/adminApi'

import MyNotification from '../../../components/MyNotification'
import UpLoadAdmin from '../UpLoadAdmin/UpLoadAdmin';

const AddAdmin = ({open,setOpen,loadAdminList,roleList,loginId,setLoginId}) => {
    //创建表单实例
    let[form] = Form.useForm()

    //通知框状态
    let [noteMsg,setNoteMsg] = useState({type:'',description:''})
    
    //关闭右边抽屉并清空表单
    const onClose = () => {
        setOpen(false)  //关闭抽屉
        setLoginId('')   //取消编辑状态
        clear()  //清空表单
    };
    //编辑状态
    useEffect(()=>{
        if(loginId){
            $getOne(loginId).then(data=>form.setFieldsValue(data))
        }
    },[loginId])


    

    //表单提交的方法
    const onFinish = async (values) => {
        try{
            if(loginId)
            {
                //修改账户
                let {success,message} = await $update(values)
                console.log({success,message})
                if(success)
                {
                    setNoteMsg({type:'success',description:message})
                    loadAdminList()
                    setOpen(false)
                    setLoginId('')   //取消编辑状态
                    form.resetFields()
                }
                else{
                    setNoteMsg({type:'error',description:message})
                    setLoginId('')   //取消编辑状态
                    setOpen(false)
                }
            }
            else{
                //添加账户
                let {success,message} = await $add(values)
                if(success)
                {
                    setNoteMsg({type:'success',description:message})
                    setOpen(false)
                    clear()
                    loadAdminList()
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
            title={loginId ? '修改账户':'添加账户'}
            placement="right" 
            onClose={onClose} 
            open={open} 
            width={500}>
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
                label="编号"
                name="id"
                hidden={true}/>
                <Form.Item
                label="账号"
                name="loginId"
                rules={[
                    {
                    required: true,
                    message: '请输入账号',
                    },
                ]}
                >
                <Input disabled={loginId ? true:false}/>
                </Form.Item>
                <Form.Item
                label="姓名"
                name="name"
                rules={[
                    {
                    required: true,
                    message: '请输入姓名',
                    },
                ]}
                >
                <Input/>
                </Form.Item>
                <Form.Item
                label="电话"
                name="phone"
                rules={[
                    {
                    required: true,
                    message: '请输入电话',
                    },
                ]}
                >
                <Input/>
                </Form.Item>
                
                <Form.Item
                label="头像"
                name="photo"
                rules={[
                    {
                    required: true,
                    message: '请输入头像',
                    },
                ]}
                >
                    <UpLoadAdmin form={form}/>
                </Form.Item>
                <Form.Item 
                label="角色"
                name="roleId"
                rules = {[
                    {
                        required: true,
                        message: '请选择角色',
                    }
                ]}
                >
                    <Select options={roleList}></Select>
                </Form.Item>
                <Form.Item
                wrapperCol={{
                    offset: 4,
                    span: 16,
                }}
                >
                <Button type='primary' htmlType='submit'>{loginId ? '修改':'添加'}</Button>
                <Button  onClick={onClose} style={{marginLeft:'10px'}}>取消</Button>
                </Form.Item>
                </Form>
            </Drawer>
            <MyNotification noteMsg = {noteMsg}/>
        </Fragment>
    );
}

export default AddAdmin;
