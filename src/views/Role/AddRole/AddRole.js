import React, {Fragment,useState,useEffect} from 'react';
import {Button,Drawer,Form,Input } from 'antd'
import {$add,$getOne,$update} from '../../../api/roleApi'
import MyNotification from '../../../components/MyNotification'

const AddRole = ({open,setOpen,loadList,roleId,setRoleId}) => {
 
    //创建表单实例
    let[form] = Form.useForm()

    //通知框状态
    let [noteMsg,setNoteMsg] = useState({type:'',description:''})
    
    //关闭右边抽屉并清空表单
    const onClose = () => {
        setOpen(false)  //关闭抽屉
        setRoleId(-1)   //取消编辑状态
        form.setFieldsValue({roleName:''})  //清空表单
    };
    //编辑状态
    useEffect(()=>{
        if(roleId>=0){
            $getOne(roleId).then(data=>form.setFieldsValue(data))
        }
    },[roleId])

    //表单提交的方法
    const onFinish = async (values) => {
        try{
            if(roleId >=0 )
            {
                //修改角色
                let {success,message,_} = await $update({id:roleId,...values})
                if(success)
                {
                    setNoteMsg({type:'success',description:message})
                    loadList()
                    setOpen(false)
                    setRoleId(-1)   //取消编辑状态
                    form.resetFields()
                }
                else{
                    setNoteMsg({type:'error',description:message})
                    setRoleId(-1)   //取消编辑状态
                    setOpen(false)
                }
            }
            else{
                //太你家角色
                let {success,message,_} = await $add(values)
                if(success)
                {
                    setNoteMsg({type:'success',description:message})
                    loadList()
                    setOpen(false)
                    form.resetFields()
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

    return (
        <Fragment>
            <Drawer 
            title={roleId>=0 ? '修改角色':'添加角色'}
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
                label="角色名称"
                name="roleName"
                rules={[
                    {
                    required: true,
                    message: 'Please input your username!',
                    },
                ]}
                >
                <Input disabled={roleId === 1 ? true : false}/>
                </Form.Item>
                <Form.Item
                wrapperCol={{
                    offset: 4,
                    span: 16,
                }}
                >
                <Button type='primary' htmlType='submit'>{roleId>=0 ? '修改':'添加'}</Button>
                <Button onClick={onClose} style={{marginLeft:'10px'}}>取消</Button>
                </Form.Item>
                </Form>
            </Drawer>
            <MyNotification noteMsg = {noteMsg}/>
        </Fragment>
    );
}

export default AddRole;
