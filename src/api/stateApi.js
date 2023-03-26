import axiosInstance from '../utils/request'

//客房状态列表
export const $stateList = async (params)=>{
    let {data} = await axiosInstance.get('State/List',{params})
    return data
}
//房间状态列表（无入住状态）
export const $listToUpdate = async (params)=>{
    let {data} = await axiosInstance.get('State/ListToUpdate',{params})
    return data
}