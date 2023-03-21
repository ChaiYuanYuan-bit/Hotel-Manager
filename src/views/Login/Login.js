import React, {useState,useEffect} from "react";
import {useNavigate} from 'react-router-dom'
import { Button, Form, Input } from "antd";
import MyNotification from '../../components/MyNotification'
import {$login} from '../../api/adminApi'
import "./Login.scss";

const Login = () => {
    //通知框状态
    let [noteMsg,setNoteMsg] = useState({type:'',description:''})
    //表单
    let [form] = Form.useForm()
    //导航
    let navigate = useNavigate()

    //判断是否已登录
    useEffect(()=>{
        if(sessionStorage.getItem('token')){
            navigate('/layout')
        }
    },[])
    
    //表单成功提交方法
    const onFinish = async (values) => {
       const {message,success} = await $login(values)
       //判断是否登录成功
       if(success){
        setNoteMsg({type:'success',description:message})
        //跳转到首页
        navigate('/layout')
       }
       else{
        setNoteMsg({type:'error',description:message})
       }
    };

    return (
        <div className="login">
            <div className="content">
                <h2>酒店后台管理系统</h2>
                <Form
                name="basic"
                form={form}
                labelCol={{
                    span: 4,
                }}
                wrapperCol={{
                    span: 18,
                }}
                initialValues={{
                    loginId: '',
                    loginPwd:''
                }}
                onFinish={onFinish}
                autoComplete="off"
                >
                <Form.Item
                    label="账号"
                    name="loginId"
                    rules={[
                    {
                        required: true,
                        message: "请输入账号",
                    },
                    ]}
                >
                    <Input />
                </Form.Item>
                    
                <Form.Item
                    label="密码"
                    name="loginPwd"
                    rules={[
                    {
                        required: true,
                        message: "请输入密码",
                    },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                    offset: 4,
                    span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        登录
                    </Button>
                    <Button onClick={()=>{
                        form.resetFields()
                    }} style={{marginLeft:'10px'}} type="primary" htmlType="submit">
                        取消
                    </Button>
                </Form.Item>
                </Form>
            </div>
            <MyNotification noteMsg = {noteMsg}/>
        </div>
    );
};

export default Login;
