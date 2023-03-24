import axiosInstance from '../utils/request'

//角色列表
export const $roleList = async ()=>{
    let {data} = await axiosInstance.get('Role/List')
    return data
}

//添加角色
export const $add = async (params)=>{
    let {data} = await axiosInstance.post('Role/Add',params)
    return data
}

//删除角色
export const $del = async (id)=>{
    let {data} = await axiosInstance.delete(`Role/Delete`,{params:{id}})
    return data
}

//修改角色
export const $update = async (params)=>{
    let {data} = await axiosInstance.put(`Role/List`,params)
    return data
}

//获取单个角色
export const $getOne = async (id)=>{
    let {data} = await axiosInstance.get(`Role/List`,{params:{id}})
    return data
}