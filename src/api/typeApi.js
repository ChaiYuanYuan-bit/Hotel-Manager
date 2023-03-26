import axiosInstance from "../utils/request";

//房型列表
export const $typeList = async ()=>{
    let {data} = await axiosInstance.get('RoomType/List')
    return data
}
//添加房型
export const $add = async (params)=>{
    let {data} = await axiosInstance.post('RoomType/Add',params)
    return data
}
//删除房型
export const $del = async (id)=>{
    let {data} = await axiosInstance.delete(`RoomType/Delete`,{params:{id}})
    return data
}

//修改房型
export const $update = async (params)=>{
    let {data} = await axiosInstance.put(`RoomType/Update`,params)
    return data
}

//获取单个房型
export const $getOne = async (id)=>{
    let {data} = await axiosInstance.get(`RoomType/List`,{params:{id}})
    return data
}