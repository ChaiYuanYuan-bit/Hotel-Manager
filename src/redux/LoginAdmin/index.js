import {createSlice} from '@reduxjs/toolkit'

//创建子模块
const loginAdmin = createSlice({
    name:'loginAdmin',
    //初始状态
    initialState:{
        admin:{}
    },
    //操作状态
    reducers:{
        setAdmin:(state,{payload})=>{
            state.admin = payload.admin
        }
    }
})

export const {setAdmin} = loginAdmin.actions

export default loginAdmin.reducer