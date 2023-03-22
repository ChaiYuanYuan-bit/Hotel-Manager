import React, {Fragment,useState,useEffect} from 'react';
import {Button,Drawer,Form,Input } from 'antd'
import {$add} from '../../../api/roleApi'
import MyNotification from '../../../components/MyNotification'

const AddRole = ({open,setOpen,loadList}) => {
 
    //创建表单实例
    let[form] = Form.useForm()

    //通知框状态
    let [noteMsg,setNoteMsg] = useState({type:'',description:''})
    
    //关闭右边抽屉
    const onClose = () => {
        setOpen(false);
    };

    //表单提交的方法
    const onFinish = async (values) => {
        try{
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
        catch(error){
            setNoteMsg({type:'error',description:'网络错误'})
            setOpen(false)
        }
    }

    //清空表单的方法
    const clearForm = () => {
        setOpen(false)
        form.setFieldsValue({roleName:''})
    }

    return (
        <Fragment>
            <Drawer title="添加角色" placement="right" onClose={onClose} open={open} width={500}>
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
                <Input/>
                </Form.Item>
                <Form.Item
                wrapperCol={{
                    offset: 4,
                    span: 16,
                }}
                >
                <Button type='primary' htmlType='submit'>添加</Button>
                <Button onClick={clearForm} style={{marginLeft:'10px'}}>取消</Button>
                </Form.Item>
                </Form>
            </Drawer>
            <MyNotification noteMsg = {noteMsg}/>
        </Fragment>
    );
}

export default AddRole;
