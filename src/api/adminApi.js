import axiosInstance from '../utils/request'

//登录
export const $login = async (params)=>{
    let {data} = await axiosInstance.get('Admin/Login',{params})
    if(data.success){
        sessionStorage.setItem('token',data.token)
    }
    return data
}

//账户列表
export const $accountList = async (params)=>{
    let {data} = await axiosInstance.get('Admin/List',{params})
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

//删除账户
export const $del = async (params)=>{
    let {data} = await axiosInstance.delete(`Admin/Delete`,{params})
    return data
}

//修改密码
export const $resetPwd = async (params) => {
    let {data} = await axiosInstance.post(`Admin/ResetPwd`,params)
    return data
}
