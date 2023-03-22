import React,{useEffect} from 'react';
import {notification} from 'antd'

const MyNotification = ({noteMsg}) => {
    const {type,description} = noteMsg
    // console.log({type,description})
    const [api, contextHolder] = notification.useNotification();
    useEffect(()=>{
        //如果type有值，打开通知框
        if(type){
        api[type]({
            message:'系统提示',
            description,
            duration:1
            });
        }
    },[noteMsg])
    return (
        <>
            {contextHolder}
        </>
    );
}

export default MyNotification;
