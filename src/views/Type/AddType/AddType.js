import React, {Fragment,useState,useEffect} from 'react';
import {Button,Drawer,Form,Input,Select } from 'antd'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {$add,$update,$getOne} from '../../../api/typeApi'
import MyNotification from '../../../components/MyNotification';


const AddType = ({open,setOpen,loadList,typeList,typeId,setTypeId}) => {
    //创建表单实例
    let[form] = Form.useForm()

    //通知框状态
    let [noteMsg,setNoteMsg] = useState({type:'',description:''})
    
    //关闭右边抽屉并清空表单
    const onClose = () => {
        setOpen(false)  //关闭抽屉
        setTypeId(0)   //取消编辑状态
        clear()  //清空表单
    };
    //编辑状态
    useEffect(()=>{
        if(typeId){
            $getOne(typeId).then(data=>form.setFieldsValue(data))
        }
    },[typeId])


    //表单提交的方法
    const onFinish = async (values) => {
        try{
            if(typeId>0)
            {
                //修改房型
                console.log('values', values)
                let {success,message} = await $update(values)
                console.log({success,message})
                if(success)
                {
                    setNoteMsg({type:'success',description:message})
                    loadList()
                    setOpen(false)
                    setTypeId(0)   //取消编辑状态
                    clear()
                }
                else{
                    setNoteMsg({type:'error',description:message})
                    setTypeId(0)   //取消编辑状态
                    setOpen(false)
                    clear()
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
                    loadList()
                }
                else{
                    setNoteMsg({type:'error',description:message})
                    setOpen(false)
                    clear()
                }
            }
            
        }
        catch(error){
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
            title={typeId>0 ? '修改房型':'添加房型'}
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
                label="房型编号"
                name="id"
                hidden={true}/>
                <Form.Item
                label="房型名称"
                name="typeName"
                rules={[
                    {
                    required: true,
                    message: '请输入房型名称',
                    },
                ]}
                >
                <Input/>
                </Form.Item>
                <Form.Item
                label="房型价格"
                name="roomTypePrice"
                rules={[
                    {
                    required: true,
                    message: '请输入房型价格',
                    },
                ]}
                >
                <Input/>
                </Form.Item>
                
                <Form.Item
                label="床位数量"
                name="bedNum"
                rules={[
                    {
                    required: true,
                    message: '请输入床位数量',
                    },
                ]}
                >
                <Input/>
                </Form.Item>
                <Form.Item
                label="房型描述"
                name="typeDescription"
                rules={[
                    {
                    required: true,
                    message: '请输入房型描述',
                    },
                ]}
                >
                <ReactQuill
                className='publish-quill'
                theme='snow'
                placeholder='请输入房型描述'/>
                </Form.Item>
                <Form.Item
                wrapperCol={{
                    offset: 4,
                    span: 16,
                }}
                >
                <Button type='primary' htmlType='submit'>{typeId>0 ? '修改':'添加'}</Button>
                <Button  onClick={onClose} style={{marginLeft:'10px'}}>取消</Button>
                </Form.Item>
                </Form>
            </Drawer>
            <MyNotification noteMsg = {noteMsg}/>
        </Fragment>
    );
}

export default AddType;
