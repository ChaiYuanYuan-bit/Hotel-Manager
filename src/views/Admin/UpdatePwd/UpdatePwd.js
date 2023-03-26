import React,{useEffect,useState} from 'react';
import { useSelector } from 'react-redux';
import { Form,Input,Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import md5 from 'md5'
import {$resetPwd} from '../../../api/adminApi'
import MyNotification from '../../../components/MyNotification';
const UpdatePwd = () => {
    //定义表单实例
    let [form] = Form.useForm()
    //通知框状态
    let [noteMsg,setNoteMsg] = useState({type:'',description:''})
    //登陆状态
    const {admin} = useSelector(store=>store.loginAdmin)
    //路由
    const navigate = useNavigate()

    //关闭右边抽屉并清空表单
    const onClose = () => {
        
    };
    //
    const onFinish = async (values) => {
        //对密码进行加密
        values.prePassword  = md5(values.prePassword)
        values.password = md5(values.password)
        try {
            const {id,prePassword,password} = values
            const {message,success} = await $resetPwd({id,prePassword,password})
            if(success)
            {
                setNoteMsg({type:'success',description:message})
                setTimeout(()=>{
                    //清除系统缓存
                    sessionStorage.clear()
                    localStorage.clear()
                    //跳转到登录页
                    navigate('/')
                },1500)
            }
            else
            {
                setNoteMsg({type:'error',description:message})
            }
        } catch (error) {
            setNoteMsg({type:'error',description:'网络错误'})
        }
    }
    
    //副作用
    useEffect(()=>{
        //赋予id值
        form.setFieldValue('id',admin.id)
    },[admin.id])
    return (
        <div>
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
                hidden={true}>
                    <Input/>
                </Form.Item>
                <Form.Item
                label="原始密码"
                name="prePassword"
                rules={[
                    {
                    required: true,
                    message: '请输入原始密码',
                    },
                ]}
                >
                <Input.Password disabled={admin.id===1?true:false}/>
                </Form.Item>
                <Form.Item
                label="最新密码"
                name="password"
                rules={[
                    {
                    required: true,
                    message: '请输入最新密码',
                    },
                ]}
                >
                <Input.Password disabled={admin.id===1?true:false}/>
                </Form.Item>
                <Form.Item
                name="confirm"
                label="确认密码"
                dependencies={['password']}
                hasFeedback
                rules={[
                {
                    required: true,
                    message: '请输入确认密码',
                },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次密码输入不一致!'));
                    },
                }),
                ]}
                >
                    <Input.Password disabled={admin.id===1?true:false}/>
                </Form.Item>
                <Form.Item
                wrapperCol={{
                    offset: 4,
                    span: 16,
                }}
                >
                <Button disabled={admin.id===1?true:false} title={admin.id===1?'初始管理员不可修改':''} type='primary' htmlType='submit'>修改</Button>
                <Button  onClick={onClose} style={{marginLeft:'10px'}}>取消</Button>
                </Form.Item>
                <MyNotification noteMsg={noteMsg}/>
                </Form>
        </div>
    );
}

export default UpdatePwd;
