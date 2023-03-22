const express = require("express")
const axios = require("axios")
const app = express()
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
let key = "fuTkisMQQ2j1ESC0cbaQen1ZWmkMdvLx"
let expir = 60 * 30 //30min(token过期的时间)
const { json } = require('body-parser')

const user  = 'admin'
const pwd = 'c8837b23ff8aaa8a2dde915473ce0991'

/*
  请求地址： http://localhost:3000/search/users?q=aa

  后台路由
    key： /search/users
    value： function () {}
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

//查询列表
app.get("/Role/List", function (req, res) {
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

//增加元素
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

//修改元素
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

//删除元素
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


app.listen(5000, "localhost", (err) => {
  if (!err){
  	console.log("服务器启动成功")
  	console.log("请求访问：http://localhost:5000")
  } 
  else console.log(err);
})
