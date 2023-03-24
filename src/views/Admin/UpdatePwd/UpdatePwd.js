import React from 'react';
import { Form,Input,Button } from 'antd';

const UpdatePwd = () => {
    //定义表单实例
    let [form] = Form.useForm()

    //关闭右边抽屉并清空表单
    const onClose = () => {
        
    };
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
                // onFinish={onFinish}
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
                name="password"
                rules={[
                    {
                    required: true,
                    message: '请输入原始密码',
                    },
                ]}
                >
                <Input.Password/>
                </Form.Item>
                <Form.Item
                label="最新密码"
                name="password1"
                rules={[
                    {
                    required: true,
                    message: '请输入最新密码',
                    },
                ]}
                >
                <Input.Password/>
                </Form.Item>
                <Form.Item
                label="确认密码"
                name="password2"
                rules={[
                    {
                    required: true,
                    message: '请输入确认密码',
                    },
                ]}
                >
                <Input.Password/>
                </Form.Item>
                <Form.Item
                wrapperCol={{
                    offset: 4,
                    span: 16,
                }}
                >
                <Button type='primary' htmlType='submit'>修改</Button>
                <Button  onClick={onClose} style={{marginLeft:'10px'}}>取消</Button>
                </Form.Item>
                </Form>
        </div>
    );
}

export default UpdatePwd;
