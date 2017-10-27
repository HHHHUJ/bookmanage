var express = require('express');
var router = express.Router();
var conn = require('../utils/conn.js')
var async = require('async');
var id = 512017000;
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register',(req,res)=>{
    //读者注册
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
    var d = new Date();
    var newD = date1String(d);
    id++;
    var newDate = newD.slice(0,10);
      var insertData = function(db,callback){
        var conn = db.collection("readerinfo");
          async.waterfall([
            function(callback){
              conn.find({username:username}).toArray((err,result)=>{
                if(err) throw err;
                var len = result.length;
                if(len>0){
                  callback(null,true);//证明数据库存在这条信息，不能注册
                }else{
                  callback(null,false);//可以注册
                }
              })
            },function(arg,callback){
               if(arg){
                 callback(null,0)//不能注册
               }else{
                 conn.insert({username:username,password:password,date:newDate,id:id},(err,result)=>{
                   console.log("################################")
                      req.session.uid = id;
                      console.log(req.session)
                      callback(null,1)//可以注册
                 }) 
               }
            }
          ],function(err,result){
            callback(result)
          })
      }
      // var db = commonFn.mongoconnect();
      conn.getDb((err,db)=>{
        if(err) throw err;
          insertData(db,function(result){
            if(result=='1'){
              //可以注册
              res.redirect('/')//重定向
            }else{
              //不能注册
              console.log('不能注册')
              res.redirect("/register");  
            }
          })
      })
});
router.post('/login',(req,res)=>{
  //读者登录
  var username = req.body.username;
  var password = req.body.password;
  var findData = function(db,callback){
    var collection = db.collection("readerinfo");
    collection.find({username:username},{_id:0,username:1,password:1,id:1}).toArray((err,result)=>{
      if(err) throw err;
      callback(result);
    })
  }
  conn.getDb((err,db)=>{
    if(err) throw err;
    findData(db,function(result){
      if(result.length>0){
        //数据库有你的信息
        req.session.username = username;
        req.session.uid = result[0].id;
        res.redirect('/reader')
      }else{
        //数据库没有你的信息
        res.send(`<script>alert("登录失败");location.href='/'</script>`)
      }
    })
  })
});

 //管理员登录
router.post('/managerlogin',(req,res)=>{
  var username = req.body.username;
  var password = req.body.password;
  conn.getDb((err,db)=>{
    if(err) throw err;
    console.log("管理员登录了")
    var collection = db.collection("managerinfo");
    collection.find({username:username,password:password}).toArray((err,result)=>{
      if(err) throw err;
      var len = result.length;
      if(len>0){
        req.session.username = username;
        res.redirect('/manager')
      }else{
        res.send(`<script>alert("登录失败");location.href='/managerlogin'</script>`)
      }
    }) 
  })
});


function date1String(date,sign){
  sign = sign==undefined?'/':sign;
  return date.getFullYear()+sign+isDblNum(date.getMonth()+1)+sign+isDblNum(date.getDate())+' '+isDblNum(date.getHours())+":"+isDblNum(date.getMinutes())+':'+isDblNum(date.getSeconds());
}
//把个位数补上零
function isDblNum(item){
  return item = item<10?'0'+item:item;
}
module.exports = router;
