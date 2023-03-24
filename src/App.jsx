import React,{useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { useRoutes } from 'react-router-dom';
import {$getOne} from './api/adminApi'
import routes from './routes';
import { setAdmin } from "./redux/LoginAdmin";

const App = () => {
    const dispatch = useDispatch()
    //解决刷新redux重置后数据丢失问题：从登陆后本地sessionStorage保存的数据中获取
    useEffect(()=>{
        //判断是否为登录状态
        if(sessionStorage.getItem('loginId'))
        {
            //获取登录账号
            let loginId = sessionStorage.getItem('loginId')
            // //根据登录名获取账户信息
            $getOne(loginId)
            .then(admin=>dispatch(setAdmin({admin})))
        }
    },[])
    const element = useRoutes(routes)
    return (
        <div>
            {element}
        </div>   
    );
}

export default App;
