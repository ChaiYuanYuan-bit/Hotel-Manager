import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    NotificationOutlined,
    HomeOutlined,
    MailOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { Layout, Menu, theme} from 'antd';
import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom'
import './Layout.scss'

const { Header, Sider, Content } = Layout;

//顶部菜单
const headerItems = [
    {
      label: '首页',
      key: 'home',
      icon: <HomeOutlined />,
    },
    {
        label: '邮件',
        key: 'mail',
        icon: <MailOutlined />,
    },
    {
    label: '通知',
    key: 'note',
    icon: <NotificationOutlined />,
    },
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
  ];

//侧边栏菜单
const  siderItems=[
    {
        key: '1',
        icon: <UserOutlined />,
        label: '账户管理',
        children:[
            {
                key:'1-1',
                label:'角色管理'
            },
            {
                key:'1-2',
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
                key:'2-1',
                label:'房型管理'
            },
            {
                key:'2-2',
                label:'房间管理'
            },
            {
                key:'2-3',
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
    //侧边栏折叠状态
    const [collapsed, setCollapsed] = useState(false);
    //顶部菜单蓝状态
    const [current, setCurrent] = useState('home');
    
    const navigate = useNavigate()

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const onClick = (e) => {
        setCurrent(e.key);
        switch(e.key){
            //退出系统
            case 'exit':
                    sessionStorage.clear()
                    localStorage.clear()
                    navigate('/')
                    break;
            default:;
        }
      };

    return (
        <Layout className='ant-layout '>
        <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
            <div className="logo" ><p>{collapsed ? 'Bing' : 'Bing酒店后台管理系统'}</p></div>
            <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
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
            <Menu style={{flexDirection:'row-reverse',flex:1}} onClick={onClick} selectedKeys={[current]} mode="horizontal" items={headerItems.reverse()} />
            </Header>
            <Content
            style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
                background: colorBgContainer,
            }}
            >
            Content
            </Content>
        </Layout>
        </Layout>
    );
};