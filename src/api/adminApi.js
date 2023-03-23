import axiosInstance from '../utils/request'
import md5 from 'md5'

//登录
export const $login = async (params)=>{
    //对密码进行加密
    params.loginPwd  = md5(params.loginPwd)
    let {data} = await axiosInstance.get('Admin/Login',{params})
    if(data.success){
        sessionStorage.setItem('token',data.token)
    }
    return data
}

//账户列表
export const $list = async ()=>{
    let {data} = await axiosInstance.get('Admin/List')
    return data
}

//添加账户
export const $add = async (params)=>{
    let {data} = await axiosInstance.post('Admin/Add',params)
    return data
}

//上传头像
export const $upload = async (params)=>{
    let {data} = await axiosInstance.post('Admin/UploadImg',params)
    return data
}

//获取单个账户信息
export const $getOne = async (loginId)=>{
    let {data} = await axiosInstance.get(`Admin/GetOne`,{params:{loginId}})
    return data
}

//更新单个账户信息
export const $update = async (params)=>{
    let {data} = await axiosInstance.put(`Admin/Update`,{...params})
    return data
}

//更新单个账户信息
export const $del = async (params)=>{
    let {data} = await axiosInstance.delete(`Admin/Delete`,{params})
    return data
}