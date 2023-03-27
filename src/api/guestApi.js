import axiosInstance from '../utils/request'

//顾客列表
export const $guestList = async (params)=>{
    let {data} = await axiosInstance.get('GuestRecord/List',{params})
    return data
}
//获取单个顾客
export const $getOne = async (loginId)=>{
    let {data} = await axiosInstance.get(`GuestRecord/GetOne`,{params:{loginId}})
    return data
}
//添加顾客
export const $add = async (params)=>{
    let {data} = await axiosInstance.post('GuestRecord/Add',params)
    return data
}
//修改顾客
export const $update = async (params)=>{
    let {data} = await axiosInstance.put(`GuestRecord/Update`,{...params})
    return data
}
//结账状态列表
export const $stateList = async (params)=>{
    let {data} = await axiosInstance.get(`GuestState/List`,{...params})
    return data
}
//删除顾客
export const $del = async (params)=>{
    let {data} = await axiosInstance.delete(`GuestRecord/Delete`,{params})
    return data
}
