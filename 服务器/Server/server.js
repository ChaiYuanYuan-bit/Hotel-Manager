const express = require("express")
const axios = require("axios")
const app = express()
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
const { response } = require("express");
let key = "fuTkisMQQ2j1ESC0cbaQen1ZWmkMdvLx"
let expir = 60 * 30 //30min(token过期的时间)

const user  = 'admin'
const pwd = 'c8837b23ff8aaa8a2dde915473ce0991'

/*
 URL:

*/
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/**********************************Admin*****************************************/


//生成token
const generateToken = function (user) {
  let token = jwt.sign({ user }, key, { expiresIn: expir });
  return token;
}

//登录验证
app.get("/Admin/Login", function (req, res) {
  console.log('get /Admin/Login:')
  const {loginId,loginPwd} = req.query
  axios.get('http://localhost:3004/admin').then(response => {
    let isExist = false
    response.data.data.map((item)=>{
      if(item.loginId===loginId){
        isExist=true
        if(item.password===loginPwd)
        {
          res.json({message:'登陆成功',success:true,token:generateToken(user)})
          
        }
        else
        {
          res.json({message:'密码错误',success:false})
        }
      }
    })
    if(!isExist){
      res.json({message:'用户名不存在',success:false})
    }
  })
});

//修改密码
app.post("/Admin/ResetPwd", function (req, res) {
  console.log('post /Admin/ResetPwd:')
  const {id,prePassword,password} = req.body
  console.log('req.query', req.body)
  axios.get('http://localhost:3004/admin').then(response => {
  let isChange = false
  let newData =  response.data.data.map((item)=>{
      if(item.id===id){
        // console.log(item.password, prePassword)
        if(item.password===prePassword)
        {
          isChange = true
          return {...item,password}
        }
        else
        {
          res.json({message:'原始密码输入错误',success:false})
        }
      }
      return item
    })
  console.log('newData', newData)
  if(isChange)
  {
    axios.put(`http://localhost:3004/admin`,{...response.data,data:newData})
        .then(response => {
          res.json({message:'修改成功',success:true})
    }).catch(error=>res.json({success:false,message:'修改失败'}))
  }

  })
});

//查询账户列表 
app.get("/Admin/List", function (req, res) {
  console.log('get /Admin/List:')
  let roleId = Number(req.query.roleId)
  let pageSize = Number(req.query.pageSize)
  let pageIndex = Number(req.query.pageIndex)
  let totalCount = pageSize*pageIndex
  axios.get('http://localhost:3004/admin').then(response => {
  let preData = response.data
  //删除密码属性
  preData.data = preData.data.map((item)=>{
    const {id,loginId,name,phone,photo,roleId} = item
    return  {id,loginId,name,phone,photo,roleId}
  })
  //数据分类
  if(roleId&&roleId>0)
  {
    preData.data = preData.data.filter((item)=>{
      if(item.roleId===roleId)
        return true
      else
        return false
    })
  }
  let count = preData.data.length

  //分页查询
  if(count <= pageSize){
    //若实际数量小于单页数量，则将数据全部返回
    res.json({count:response.data.data.length,...response.data,pageSize:count,pageIndex:1})
  }
  else if(count<=totalCount){
    //若实际数量小于等于要获取的总数量，则返回最后一页数据
    let start = parseInt(count/pageSize)*pageSize
    let end = count
    preData.data = preData.data.slice(start,end)
    res.json({count,...preData,pageIndex,pageSize})
  }
  else{
    //若实际数量大于要获取的总数量，则返回要获取的那一页数据
    let start = totalCount-pageSize
    let end = totalCount
    preData.data = preData.data.slice(start,end)
    res.json({count,...preData,pageIndex,pageSize})
  }
  })
});

//查询单个账户
app.get("/Admin/GetOne", function (req, res) {
  console.log('get /Admin/GetOne:')
  console.log('req.query', req.query)
  let isExist=false;
  axios.get('http://localhost:3004/admin').then(response => {
    response.data.data.map((item)=>{
      if(item.loginId===req.query.loginId){
        isExist = true
        const {id,loginId,name,phone,photo,roleId} = item
        res.json({id,loginId,name,phone,photo,roleId})
        return
      }
      return
    })
    if(!isExist)
    {
      res.json({success:false,message:'找不到该账户'})
    }
  })
});

//访问账户头像
app.get("/Admin/UpLoad", function (req, res) {
  res.sendFile('./public/test.jpg');
});

//增加账户
app.post("/Admin/Add", function (req, res) {
  console.log('post /Admin/Add:')
  axios.get('http://localhost:3004/admin').then(response => 
  {
    preData = response.data
    let isRepeat = false
    preData.data.map((item)=>{
      if (item.loginId === req.body.loginId){
        isRepeat=true
      } 
    })
    if(isRepeat)
    {
      res.json({success:false,message:'账户已存在，请更换账户'})
    }
    else
    {
      let count = preData.data.length
      newData = {...preData,data:[...preData.data,{id:count+1,...req.body,password:'c8837b23ff8aaa8a2dde915473ce0991'}]}
      axios.post('http://localhost:3004/admin',newData)
      .then(response => 
        {
            res.json({success:true,message:'添加成功'}) 
        })
      .catch(error=>res.json({success:false,message:'添加失败'}))
    }
  })
  .catch(error=>console.log('error', error))
  }
);

//上传账户头像
app.post("/Admin/UploadImg", function (req, res) {
  console.log('post /Admin/UploadImg:')
  res.json({...req.body,success:true,massage:"上传成功"})}
);

//修改账户
app.put("/Admin/Update", function (req, res) {
  console.log('put /Admin/Update:')
  var pre_data = []
  var next_data=req.body
  axios.get('http://localhost:3004/admin').then(response => {
    pre_data =  response.data
  }).then(()=>{
      pre_data.data = pre_data.data.map((item)=>{
        if (item.loginId === next_data.loginId)
          return {...next_data,id:item.id}
        else
          return item
      })
        axios.put(`http://localhost:3004/admin`,pre_data)
        .then(response => {
          res.json({success:true,message:'修改成功'}) 
    }).catch(error=>res.json({success:false,message:'修改失败'}))
  })
  .catch((error)=>{console.log('error', error)})
});

//删除账户
app.delete("/Admin/Delete", function (req, res) {
  console.log('delete /Admin/Delete:')
  if(req.query.id==='1'){
      res.json({success:false,message:'初始角色不可删除'})
  }
  else{
    var pre_data = []
    var next_data=req.query
    axios.get('http://localhost:3004/admin').then(response => {
      pre_data =  response.data
    }).then(()=>{
      pre_data.data = pre_data.data.filter((item)=>{
          if (item.id===Number(next_data.id))
            return false
          else
            return true
        })
          axios.put(`http://localhost:3004/admin`,pre_data)
          .then(response => {
            res.json({success:true,message:'删除成功'}) 
      }).catch(error=>res.json({success:false,message:'删除失败'}))
    })
    .catch((error)=>{console.log('error', error)})
  }
});


/**********************************Role*****************************************/


//查询角色列表
app.get("/Role/List", function (req, res) {
  console.log('get /Role/List:')
  axios.get('http://localhost:3004/list',{params:req.query}).then(response => {
    if(response.data.length===1){
      res.json(...response.data)
    }
    else{
      res.json(response.data)
    }
  })
});

//增加角色
app.post("/Role/Add", function (req, res) {
  console.log('post /Role/Add:')
  var pre_data = []
  var next_data=req.body
  axios.get('http://localhost:3004/list').then(response => {
    pre_data =  response.data
  }).
  then(()=>{
    let isRepeat = false
      pre_data.map((item)=>{
        if (item.roleName === next_data.roleName)
          isRepeat = true
      })
      if(isRepeat)
      {
        res.json({success:false,message:'角色重复',list:{}})
      } 
      else{
        axios.post('http://localhost:3004/list',req.body)
        .then(response => {
          res.json({success:true,message:'添加成功',list:response.data}) 
    }).catch(error=>res.json({success:false,message:'添加失败',list:{}}))}
  })
  .catch((error)=>{console.log('error', error)})
});

//修改角色
app.put("/Role/List", function (req, res) {
  console.log('put /Role/List:')
  var pre_data = []
  var next_data=req.body
  if(req.body.id === 1)
  {
    res.json({success:false,message:'初始角色不可删除'})
  }
  else{
    axios.get('http://localhost:3004/list').then(response => {
      pre_data =  response.data
    }).then(()=>{
      let isRepeat = false
        pre_data.map((item)=>{
          if (item.roleName === next_data.roleName)
            isRepeat = true
        })
        if(isRepeat)
        {
          res.json({success:false,message:'角色重复'})
        } 
        else{
          axios.put(`http://localhost:3004/list/${req.body.id}`,{roleName:req.body.roleName})
          .then(response => {
            res.json({success:true,message:'修改成功'}) 
      }).catch(error=>res.json({success:false,message:'修改失败',list:{}}))}
    })
    .catch((error)=>{console.log('error', error)})
  }
});

//删除角色
app.delete("/Role/Delete", function (req, res) {
  console.log('delete /Role/Delete:')
  if(req.query.id==='1'){
      res.json({success:false,message:'初始角色不可删除'})
  }
  else{
      axios.delete(`http://localhost:3004/list/${req.query.id}`).then(
      res.json({success:true,message:'删除成功'})
    ).catch(()=>{
      res.json({success:false,message:'删除失败'})
    })
  }
});


/**********************************RoomType*****************************************/


//查询房型列表
app.get("/RoomType/List", function (req, res) {
  console.log('get /RoomType/List:')
  axios.get('http://localhost:3004/roomType',{params:req.query}).then(response => {
    if(response.data.length===1){
      res.json(...response.data)
    }
    else{
      res.json(response.data)
    }
  })
});

//增加房型
app.post("/RoomType/Add", function (req, res) {
  console.log('post /RoomType/Add:')
  var pre_data = []
  var next_data=req.body
  axios.get('http://localhost:3004/roomType').then(response => {
    pre_data =  response.data
  }).
  then(()=>{
    let isRepeat = false
      pre_data.map((item)=>{
        if (item.typeName === next_data.typeName)
          isRepeat = true
      })
      if(isRepeat)
      {
        res.json({success:false,message:'房型重复'})
      } 
      else{
        axios.post('http://localhost:3004/roomType',req.body)
        .then(response => {
          res.json({success:true,message:'添加成功'}) 
    }).catch(error=>res.json({success:false,message:'添加失败'}))}
  })
  .catch((error)=>{console.log('error', error)})
});

//修改房型
app.put("/RoomType/Update", function (req, res) {
  console.log('put /RoomType/Update:')
  axios.put(`http://localhost:3004/roomType/${req.body.id}`,req.body)
  .then(response => {
    res.json({success:true,message:'修改成功'})
  })
  .catch(error=>res.json({success:false,message:'修改失败'}))

});

//删除房型
app.delete("/RoomType/Delete", function (req, res) {
  console.log('delete /RoomType/Delete:')
  axios.delete(`http://localhost:3004/roomType/${req.query.id}`).then(
  res.json({success:true,message:'删除成功'})
  ).catch(()=>{
    res.json({success:false,message:'删除失败'})
  })
  
});

//每个房型的营业额

/**********************************Room*****************************************/
//查询客房列表 
app.get("/Room/List", function (req, res) {
  console.log('get /Room/List:')
  let roomStateId = Number(req.query.roomStateId)
  let roomTypeId = Number(req.query.roomTypeId)
  let pageSize = Number(req.query.pageSize)
  let pageIndex = Number(req.query.pageIndex)
  let totalCount = pageSize*pageIndex

  axios.get('http://localhost:3004/roomType').then(response => 
  {
    const roomType = response.data
    axios.get('http://localhost:3004/room')
    .then(response => 
      {
        let preData = response.data
        //数据分类
        //筛选--roomTypeId
        if(roomTypeId&&roomTypeId>0)
        {
          preData.data = preData.data.filter((item)=>{
            if(item.roomTypeId===roomTypeId)
              return true
            else
              return false
          })
        }
        //筛选--roomStateId
        if(roomStateId&&roomStateId>0)
        {
          preData.data = preData.data.filter((item)=>{
            if(item.roomState.roomStateId===roomStateId)
              return true
            else
              return false
          })
        }
        let count = preData.data.length

        //分页查询
        if(count <= pageSize){
          //若实际数量小于单页数量，则将数据全部返回
          res.json({count:response.data.data.length,...response.data,data:AddRoomType(roomType,response.data.data),pageSize:count,pageIndex:1})
        }
        else if(count<=totalCount){
          //若实际数量小于等于要获取的总数量，则返回最后一页数据
          let start = parseInt(count/pageSize)*pageSize
          let end = count
          preData.data = preData.data.slice(start,end)
          res.json({count,...preData,data:AddRoomType(roomType,preData.data),pageIndex,pageSize})
        }
        else
        {
          //若实际数量大于要获取的总数量，则返回要获取的那一页数据
          let start = totalCount-pageSize
          let end = totalCount
          preData.data = preData.data.slice(start,end)
          res.json({count,...preData,data:AddRoomType(roomType,preData.data),pageIndex,pageSize})
        }
      }
    )
  })
});

const AddRoomType = (roomType,Data)=>{
  return Data.map((d)=>{
    const type = roomType.find((r)=>r.id===d.roomTypeId)
    return {...d,roomType:type}
  })
}

//查询单个客房
app.get("/Room/GetOne", function (req, res) {
  console.log('get /Room/GetOne:')
  let isExist=false;
  axios.get('http://localhost:3004/roomType',).then(response => {
    const roomType = response.data
    axios.get('http://localhost:3004/room').then(response => {
    response.data.data.map((item)=>{
      if(item.roomId===req.query.roomId){
        isExist = true
        const type = roomType.find((r)=>r.id===item.roomTypeId)
        res.json({...item,roomType:type})
        return
      }
      return
    })
    if(!isExist)
    {
      res.json({success:false,message:'找不到该客房'})
    }
  })
  })
  
});

//修改客房
app.put("/Room/Update", function (req, res) {
  console.log('put /Room/Update:')
  var pre_data = []
  var next_data=req.body
  axios.get('http://localhost:3004/roomState').then(response => {
    const roomStateList = response.data
    axios.get('http://localhost:3004/room').then(response => {
    pre_data =  response.data
  }).then(()=>{
      pre_data.data = pre_data.data.map((item)=>{
        if (item.roomId === next_data.roomId)
        {
          const{roomTypeId,roomStateId} = next_data
          const roomState = roomStateList.find((item)=>item.roomStateId===roomStateId)
          return {...item,roomTypeId,roomState}
        }
        else
          return item
      })
        axios.put(`http://localhost:3004/room`,pre_data)
        .then(response => {
          res.json({success:true,message:'修改成功'}) 
    }).catch(error=>res.json({success:false,message:'修改失败'}))
  })
  .catch((error)=>{console.log('error', error)})
  })

});

//添加客房
app.post("/Room/Add", function (req, res) {
  console.log('post /Room/Add:')
  var pre_data = []
  var next_data=req.body
  axios.get('http://localhost:3004/room').then(response=>{
    const noExit =response.data.data.find((item)=>{
      return item.roomId === next_data.roomId
    })
    console.log('noExit', noExit)
    if(!noExit)
    {
        axios.get('http://localhost:3004/roomState').then(response => {
        const roomStateList = response.data
        axios.get('http://localhost:3004/room').then(response => {
        pre_data =  response.data
      }).then(()=>{
        const{roomId,roomTypeId,roomStateId} = next_data
        const roomState = roomStateList.find((item)=>item.roomStateId===roomStateId)
          pre_data.data.push({roomId,roomState,roomTypeId})
            axios.put(`http://localhost:3004/room`,pre_data)
            .then(response => {
              res.json({success:true,message:'添加成功'}) 
        }).catch(error=>res.json({success:false,message:'添加失败'}))
      })
      .catch((error)=>{console.log('error', error)})
      })
    }
    else{
      res.json({success:false,message:'客房ID重复'})
    }
  })
  

});

//查询单个客房
app.delete("/Room/Delete", function (req, res) {
  console.log('delete /Room/Delete:')
  axios.get('http://localhost:3004/room').then(response => {
  response.data.data=response.data.data.filter((item)=>{
    if(item.roomId===req.query.roomId){
      return false
    }
    else{
      return true
    }
  })
  axios.put(`http://localhost:3004/room`,response.data).then(()=>{
    res.json({success:true,message:'删除成功'})
  })
  .catch(error=>res.json({success:false,message:'删除失败'}))
}).catch(error=>console.log('error', error))
});

//查询可用客房列表
app.get("/Room/Remain",function (req, res){
  console.log('get /Room/Remain:')
  const {roomTypeId} = req.query
  axios.get('http://localhost:3004/room').then((response1)=>{
    const all_rooms = response1.data.data
    const want_rooms = all_rooms.filter(r=>r.roomTypeId===roomTypeId*1)
    axios.get('http://localhost:3004/guest').then(response2=>{
      const all_guests = response2.data.data
      const remain_rooms = want_rooms.filter(r=>
        r.roomState.roomStateId===1
        )
      res.json(remain_rooms)
    })
  })
})


/**********************************RoomState*****************************************/

//查询客房状态列表
app.get("/State/List", function (req, res) {
  console.log('get /State/List:')
  axios.get('http://localhost:3004/roomState',{params:req.query}).then(response => {
    if(response.data.length===1){
      res.json(...response.data)
    }
    else{
      res.json(response.data)
    }
  })
});

//查询客房状态(未入住)列表
app.get("/State/ListToUpdate", function (req, res) {
  console.log('get /State/ListToUpdate:')
  axios.get('http://localhost:3004/roomState',{params:req.query}).then(response => {
    const newStateList = response.data.filter((item)=>{
      if(item.roomStateId===2)
        return false
      else
        return true
    })
    res.json(newStateList)
  })
});

/**********************************Guest*****************************************/

//查询顾客列表 
app.get("/GuestRecord/List", function (req, res) {
  console.log('get /GuestRecord/List:')
  let guestName = req.query.guestName
  let guestStateId = Number(req.query.guestStateId)
  let pageSize = Number(req.query.pageSize)
  let pageIndex = Number(req.query.pageIndex)
  let totalCount = pageSize*pageIndex
  let preData = []
  let roomType=[]
  let rooms=[]
  let resideState=[]

  axios.get('http://localhost:3004/guest').then(response=>{
      preData = response.data
      let count = preData.data.length
      //数据筛选
      //查询顾客姓名
      if(guestName!==''){
        preData.data=[preData.data.find(item=>item.guestName===guestName)]
      } 
      //查询状态
      if(guestStateId>0)
      {
        preData.data=preData.data.filter(item=>item.resideStateId===guestStateId)
      }
      //分页查询
      if(count <= pageSize || totalCount<=0){
        //若实际数量小于单页数量，则将数据全部返回
        return {count,...response.data,pageSize:count,pageIndex:1}
      }
      else if(count<=totalCount){
        //若实际数量小于等于要获取的总数量，则返回最后一页数据
        let start = parseInt(count/pageSize)*pageSize
        let end = count
        preData.data = preData.data.slice(start,end)
        return {count,...preData,pageIndex,pageSize}
      }
      else
      {
        //若实际数量大于要获取的总数量，则返回要获取的那一页数据
        let start = totalCount-pageSize
        let end = totalCount
        preData.data = preData.data.slice(start,end)
        return {count,...preData,pageIndex,pageSize}
      }
  }).then(guestData=>{
    preData = guestData
    axios.get('http://localhost:3004/roomType').then(response1=>{
      roomType = response1.data
      axios.get('http://localhost:3004/room').then(
        response2=>{
          rooms=response2.data.data
          axios.get('http://localhost:3004/resideState').then(response3=>{
            resideState = response3.data
            preData.data=preData.data.map((d=>{
              const roomId = d.roomId
              const resideStateId = d.resideStateId
              const roomTypeId = rooms.find((r)=>{
                return r.roomId===roomId
              }).roomTypeId
              const roomtype = roomType.find((t)=>{
                return t.id===roomTypeId
              })
              const stata = resideState.find((s)=>{
                return s.resideStateId === resideStateId
              })
              return {...d,room:{roomType:roomtype},resideState:stata}
            }))

            res.json({...preData})
          })
        }
      )
    })
  })
});

//添加顾客
app.post("/GuestRecord/Add",function(req,res){
  const newGuest = req.body
  axios.get("http://localhost:3004/guest").then(response=>{
    const all_guests = response.data.data
    const isRepeat = all_guests.find(item=>item.guestName===newGuest.guestName)
    if(isRepeat)
    {
      res.json({success:false,message:'顾客已存在'})
    }
    else{
      all_guests.push({
        id:all_guests.length+1,
        guestName:newGuest.guestName,
        identityId:newGuest.identityId,
        phone:newGuest.phone,
        roomId:newGuest.roomId,
        resideDate:newGuest.resideDate,
        leaveDate:newGuest.leaveDate,
        deposit:newGuest.deposit,
        totalMoney:newGuest.totalMoney,
        guestNum:newGuest.guestNum,
        resideStateId:2
      })
      //更新guest列表
      axios.put("http://localhost:3004/guest",{...response.data,data:all_guests}).then(()=>{
      //更新客房状态
      axios.get('http://localhost:3004/room').then(response=>{
        const rooms = response.data.data
        const room_index = rooms.findIndex((item)=>{
          return item.roomId===newGuest.roomId
        })
        rooms[room_index].roomState={
          "roomStateId": 2,
          "roomStateName": "入住"
        }
        axios.put('http://localhost:3004/room',{...response.data,data:rooms}).then(()=>{
          res.json({success:true,message:"添加成功"})
        })
      })
      }).catch(error=>{
        res.json({success:false,message:"添加失败"})
        console.log('error', error)
      })
    }
  })
})

//查询单个顾客
app.get("/GuestRecord/GetOne", function (req, res) {
  console.log('get /GuestRecord/GetOne:')
  const guestId = Number(req.query.guestId)
  axios.get('http://localhost:3004/guest').then(response => {
    const guest = response.data.data.find((item)=>{
      return item.id===guestId
    })
    if(guest)
    {
      axios.get('http://localhost:3004/room').then(response=>{
        const rooms = response.data.data
        const roomTypeId = rooms.find(item=>guest.roomId===item.roomId).roomTypeId
        res.json({success:true,message:"找到该顾客",data:{...guest,roomTypeId}})
      })
      
    }
    else{
      res.json({success:false,message:"找不到该顾客",data:{}})
    }
  })
});

//结账
app.post("/GuestRecord/CheckOut",function(req,res){
  const guestId = req.body.guestId
  axios.get('http://localhost:3004/guest').then(response=>{
    const guests = response.data
    const guest_Index = guests.data.findIndex(item=>item.id===guestId)
    const totalMoney = guests.data[guest_Index].totalMoney
    guests.data[guest_Index].resideStateId = 1
    axios.put('http://localhost:3004/guest',{...guests}).then(()=>{
      res.json({totalMoney})
    })
  })
})
//修改顾客
app.put("/GuestRecord/Update",function(req,res){
  console.log('get /GuestRecord/GetOne:')
  const new_guest = req.body
  const guestId = Number(new_guest.id)
  axios.get('http://localhost:3004/guest').then(response => {
    const guests = response.data
    const old_guestIndex =guests.data.findIndex((item)=>{
      return item.id===guestId
    })
    if(old_guestIndex>=0)
    {
      //若房间没修改，就不更新room
      if(guests.data[old_guestIndex].roomId===new_guest.roomId)
      {
        guests.data[old_guestIndex] = {...new_guest,resideStateId:guests.data[old_guestIndex].resideStateId}
        axios.put('http://localhost:3004/guest',{...guests}).then(()=>{
          res.json({success:true,message:"修改成功"})
        })
        
      }
      //若房间被修改，则更新room
      else{
        axios.get('http://localhost:3004/room').then(response=>{
          const rooms = response.data
          const new_roomIndex = rooms.data.findIndex((item)=>item.roomId===new_guest.roomId)
          rooms.data[new_roomIndex].roomState = {
            "roomStateId": 2,
            "roomStateName": "入住"
          }
          const old_roomIndex = rooms.data.findIndex((item)=>item.roomId===guests.data[old_guestIndex].roomId)
          rooms.data[old_roomIndex].roomState = {
            "roomStateId": 1,
            "roomStateName": "空闲"
          }
          guests.data[old_guestIndex] = {...new_guest,resideStateId:guests.data[old_guestIndex].resideStateId}
          axios.put('http://localhost:3004/room',{...rooms}).then(()=>{
            axios.put('http://localhost:3004/guest',{...guests}).then(()=>{
              res.json({success:true,message:"修改成功"})})
          })
        })
      }    
    }
    else{
      res.json({success:false,message:"找不到该顾客",data:{}})
    }
  })
})

//删除顾客
app.delete("/GuestRecord/Delete",function(req,res){
  const guestId = req.query.guestId*1
  axios.get('http://localhost:3004/guest').then(response=>{
    const guests = response.data
    const roomId = guests.data.find(item=>item.id===guestId).roomId
    guests.data = guests.data.filter(item=>item.id!==guestId)
    axios.put('http://localhost:3004/guest',{...guests}).then(()=>{
      axios.get('http://localhost:3004/room').then(response=>{
        const rooms = response.data
        const room_Index = rooms.data.findIndex(item=>item.roomId===roomId)
        rooms.data[room_Index].roomState={
          "roomStateId": 1,
          "roomStateName": "空闲"
        }
        axios.put('http://localhost:3004/room',{...rooms}).then(()=>{
          res.json({success:true,message:`删除成功,${roomId}房间已空闲`})
        })
      })
    }).catch(error=>res.json({success:false,message:"删除失败"}))
  })
})

/**********************************GuestState*****************************************/

//查询结账状态列表
app.get("/GuestState/List", function (req, res) {
  console.log('get /GuestState/List:')
  axios.get('http://localhost:3004/resideState',{params:req.query}).then(response => {
    if(response.data.length===1){
      res.json(...response.data)
    }
    else{
      res.json(response.data)
    }
  })
});

app.listen(5000, "localhost", (err) => {
  if (!err){
  	console.log("服务器启动成功")
  	console.log("请求访问：http://localhost:5000")
  } 
  else console.log(err);
})

