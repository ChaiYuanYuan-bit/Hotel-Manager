import axiosInstance from '../utils/request'

//客房列表
export const $roomList = async (params)=>{
    let {data} = await axiosInstance.get('Room/List',{params})
    return data
}

//获取单个客房信息
export const $getOne = async (roomId)=>{
    let {data} = await axiosInstance.get(`Room/GetOne`,{params:{roomId}})
    return data
}
//查询可用客房信息
export const $remainRoomList = async (params)=>{
    let {data} = await axiosInstance.get('Room/Remain',{params})
    return data
}
//修改客房信息
export const $update = async (params)=>{
    let {data} = await axiosInstance.put('Room/Update',params)
    return data
}
//添加客房
export const $add = async (params)=>{
    let {data} = await axiosInstance.post('Room/Add',params)
    return data
}
//删除客房
export const $del = async (roomId)=>{
    let {data} = await axiosInstance.delete('Room/Delete',{params:{roomId}})
    return data
}
//显示销售统计
export const $totalTypePrice = async () => {
    let {data} = await axiosInstance.get('Room/TotalPrice')
    return data
}
