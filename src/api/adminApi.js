import axiosInstance from '../utils/request'
import md5 from 'md5'

//登录
export const $login = async (params)=>{
    //对密码进行加密
    params.loginPwd  = md5(params.loginPwd)
    let {data} = await axiosInstance.get('/Admin/Login',{params})
    if(data.success){
        sessionStorage.setItem('token',data.token)
    }
    return data
}