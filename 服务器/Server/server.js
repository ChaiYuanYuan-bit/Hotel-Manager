const express = require("express")
const axios = require("axios")
const app = express()
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
let key = "fuTkisMQQ2j1ESC0cbaQen1ZWmkMdvLx"
let expir = 60 * 30 //30min(token过期的时间)

const user  = 'admin'
const pwd = 'c8837b23ff8aaa8a2dde915473ce0991'

/*
 URL:

*/
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//生成token
const generateToken = function (user) {
  let token = jwt.sign({ user }, key, { expiresIn: expir });
  return token;
}
//登录
app.get("/Admin/Login", function (req, res) {
  console.log('get /Admin/Login:')
  const {loginId,loginPwd} = req.query
  loginId === user ? loginPwd === pwd ?  res.json({message:'登陆成功',
  success:true,token:generateToken(user)}) : res.json({message:'密码错误',success:false}):
  res.json({message:'用户名不存在',success:false})
});

//查询账户列表 
app.get("/Admin/List", function (req, res) {
  console.log('get /Admin/List:')
  console.log('req.query', req.query)
  let roleId = Number(req.query.roleId)
  let pageSize = Number(req.query.pageSize)
  let pageIndex = Number(req.query.pageIndex)
  let totalCount = pageSize*pageIndex
  axios.get('http://localhost:3004/admin').then(response => {
  let preData = response.data
  console.log('pre', preData.data)
  //删除密码属性
  preData.data = preData.data.map((item)=>{
    const {id,loginId,name,phone,photo,roleId} = item
    return  {id,loginId,name,phone,photo,roleId}
  })
  console.log('after', preData.data)
  //数据分类
  if(roleId!==0)
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
    let start = count-pageSize
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

//查询角色列表
app.get("/Role/List", function (req, res) {
  console.log('get /Role/List:')
  axios.get('http://localhost:3004/list',{params:req.query}).then(response => {
    console.log('response', response.data)
    if(response.data.length===1){
      res.json(...response.data)
    }
    else{
      res.json(response.data)
    }
  })
});

//查询单个账户
app.get("/Admin/GetOne", function (req, res) {
  console.log('get /Admin/GetOne:')
  axios.get('http://localhost:3004/admin').then(response => {
    response.data.data.map((item)=>{
      if(item.loginId===req.query.loginId){
        const {id,loginId,name,phone,photo,roleId} = item
        res.json({id,loginId,name,phone,photo,roleId})
      }
    })
  })
});

//访问图片
app.get("/Admin/UpLoad", function (req, res) {
  res.sendFile('./public/test.jpg');
});

//增加角色
app.post("/Role/Add", function (req, res) {
  console.log('post /Role/Add:')
  var pre_data = []
  var next_data=req.body
  console.log('req.body', req.body)
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

//上传头像
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

//修改角色
app.put("/Role/List", function (req, res) {
  console.log('put /Role/List:')
  console.log('req.body', req.body)
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
          console.log(typeof(item.id), typeof(next_data.id))
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


app.listen(5000, "localhost", (err) => {
  if (!err){
  	console.log("服务器启动成功")
  	console.log("请求访问：http://localhost:5000")
  } 
  else console.log(err);
})
