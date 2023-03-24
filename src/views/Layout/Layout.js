import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    NotificationOutlined,
    HomeOutlined,
    MailOutlined,
    SettingOutlined,
    ExclamationCircleFilled 
} from '@ant-design/icons';
import { Layout, Menu, theme,Modal} from 'antd';
import React, { useState,useEffect } from 'react';
import {useNavigate,Outlet} from 'react-router-dom'
import './Layout.scss'

const { Header, Sider, Content } = Layout;
const { confirm } = Modal;

//顶部菜单
const headerItems = [
    {
        label: '个人中心',
        key: 'mine',
        icon: <UserOutlined />,
        children: [
          {
            key:'myInfo',
            label: '个人信息',
          },
          {
            key:'setPwd',
            label: '修改密码',
          },
          {
              key:'exit',
              label: '退出系统',
            },
        ],
      },
    {
    label: '通知',
    key: 'note',
    icon: <NotificationOutlined />,
    },
    {
        label: '邮件',
        key: 'mail',
        icon: <MailOutlined />,
    },
    {
        label: '首页',
        key: 'home',
        icon: <HomeOutlined />,
    },
];

//侧边栏菜单
const  siderItems=[
    {
        key: '1',
        icon: <UserOutlined />,
        label: '账户管理',
        children:[
            {
                key:'role',
                label:'角色管理'
            },
            {
                key:'admin',
                label:'用户管理'
            }
        ]
    },
    {
        key: '2',
        icon: <HomeOutlined />,
        label: '客房管理',
        children:[
            {
                key:'type',
                label:'房型管理'
            },
            {
                key:'room',
                label:'房间管理'
            },
            {
                key:'total',
                label:'营业统计'
            }
        ]
    },
    {
        key: '3',
        icon: <SettingOutlined />,
        label: '客户管理',
    },
]

export default function(){
    //顶部菜单背景
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    //侧边栏折叠状态
    const [collapsed, setCollapsed] = useState(false);
    //顶部菜单蓝状态
    const [current, setCurrent] = useState('home');
    //跳转路由
    const navigate = useNavigate()  
    //判断是否已登录
    useEffect(()=>{
        if(!sessionStorage.getItem('token'))
            navigate('/layout')
    },[])
    //侧边栏菜单点击事件
    const handleSider = (e)=>{
        switch(e.key){
            //角色管理
            case 'role':
                navigate('/layout/role')
                break;
            //用户管理
            case 'admin':
                navigate('/layout/admin')
                break;
        }
    }
    //顶部菜单点击事件
    const handleTop = (e) => {
        setCurrent(e.key);
        switch(e.key){
            //个人信息
            case 'myInfo':
                navigate('/layout/mine')
                break
            //修改密码
            case 'setPwd':
                navigate('/layout/upPwd')
                break
            //退出系统
            case 'exit':
                showConfirm()
                break
            default:;
        }
      };
    //退出系统提示
    const showConfirm = () => {
    confirm({
        title: '系统提示',
        icon: <ExclamationCircleFilled />,
        content: '确定退出系统么',
        okText:'确定',
        cancelText:'取消',
        onOk() {
        //清除系统缓存
        sessionStorage.clear()
        localStorage.clear()
        //跳转到登录页
        navigate('/')
        },
    });
    };

    return (
        <Layout className='ant-layout '>
            <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
                <div className="logo" ><p>{collapsed ? 'Bing' : 'Bing酒店后台管理系统'}</p></div>
                <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['1']}
                onClick={handleSider}
                items={siderItems}
                />
            </Sider>
            <Layout>
                <Header
                style={{
                    padding: 0,
                    background: colorBgContainer,
                    display:'flex'
                }}
                >
                {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                    className: 'trigger',
                    onClick: () => setCollapsed(!collapsed),
                })}
                <Menu style={{flexDirection:'row-reverse',flex:1}} onClick={handleTop} selectedKeys={[current]} mode="horizontal" items={headerItems} />
                </Header>
                <Content
                style={{
                    margin: '24px 16px',
                    padding: 24,
                    minHeight: 280,
                    background: colorBgContainer,
                }}
                >
                    <Outlet></Outlet>
                </Content>
            </Layout>
        </Layout>
    );
};