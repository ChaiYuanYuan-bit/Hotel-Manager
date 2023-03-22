import axiosInstance from '../utils/request'

//角色列表
export const $list = async ()=>{
    let {data} = await axiosInstance.get('Role/List')
    return data
}

//添加角色
export const $add = async (values)=>{
    let {data} = await axiosInstance.post('Role/Add',values)
    return data
}

//删除角色
export const $del = async (id)=>{
    let {data} = await axiosInstance.delete(`Role/Delete`,{params:{id}})
    return data
}