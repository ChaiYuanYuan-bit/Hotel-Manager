import {configureStore} from '@reduxjs/toolkit'
import loginAdmin from './LoginAdmin'

//创建store，合并所有子模块
const store = configureStore({
    reducer:{
        loginAdmin
    }
})

export default store