import React from 'react';
import {useSelector} from 'react-redux'

const Mine = () => {
    //获取登录信息
    const {admin} = useSelector((store)=>store.loginAdmin)
    
    return (
        <div style={{display:'flex'}}>
            <img style={{width:'200px'}} src='https://tupian.qqw21.com/article/UploadPic/2019-4/201942420443049051.jpg'/>
            <div style={{marginLeft:'10px',fontSize:'20px'}}>
                <p>账号：{admin.loginId}</p>
                <p>姓名：{admin.name}</p>
                <p>电话：{admin.phone}</p>
                <p>角色：{admin.roleId}</p>
            </div>
        </div>
    );
}

export default Mine;
