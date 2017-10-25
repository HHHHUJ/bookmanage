var express = require('express');
var router = express.Router();
var conn = require('../utils/conn.js')
var async = require('async');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/login',(req,res)=>{
  res.render('login')
})
router.get('/register',(req,res)=>{
  res.render('register')
})
router.get('/reader',(req,res)=>{
    var findData = function(db,callback){
        var conn = db.collection("book");
        conn.find({},{author:1,pubdate:1,_id:0,"images.large":1,title:1,price:1,isbn10:1,id:1,summary:1,author_intro:1}).toArray((err,result)=>{
          if(err) throw err;
          callback(result);
        })
    }
    conn.getDb((err,db)=>{
        if(err) throw err;
        console.log("数据库连接成功!")
        findData(db,function(result){
            res.render("reader",{result});
        })
    })
})

//读者查询的信息，把信息返回给reader页面
router.post('/search',(req,res)=>{
  var information = req.body.username;
  console.log(information)
  var newinfo = information.replace(/\s/gi,'')
  // var info  =  eval("/" + newinfo +"/");
  var info = new RegExp(newinfo);
  // new RegExp("^hua")
  conn.getDb((err,db)=>{
    if(err) throw err;
    var coll = db.collection('book');
    coll.ensureIndex({"author":1});
    
    coll.find(
      {$or:[{id:{$regex: info, $options: 'ixm' }},
      {isbn10:{$regex: info, $options: 'ixm' }},
      {author:{$regex: info, $options: 'ixm' }},
      {title:{$regex: info, $options: 'ixm' }}]}
    ).toArray((err,result)=>{
      if(err) throw err;
      console.log('查询成功!!!!!!!!!!!')
      res.render('reader',{result});
    })
    })
  })

//书籍详情和读者评论页面
router.get('/comment',(req,res)=>{
  var bid = req.query.id;//获取书籍的id
  var username = req.session.username;
  var data = {};
  var findData = function(db,callback){
    var book = db.collection('book');
    var readerinfo = db.collection('readerinfo');
    async.series([
      function(callback){
        book.findOne({id:bid},{summary:1,author_intro:1,title:1,author:1,_id:0,price:1,publisher:1,isbn10:1,pubdate:1},(err,result)=>{
            //查询图书的数据库
            console.log('查询图书的数据库成功')
            callback(null,result);
        })
      },
      function(callback){
        //获取用户数据库
        readerinfo.find({username:username},{username:1,date:1,_id:0}).toArray((err,result)=>{
          console.log('获取用户数据库成功');
          callback(null,result);
        })
      }
    ],
      function(err,result){
        console.log('获取成功')
        callback(result);
    })
  }
  conn.getDb((err,db)=>{
    if(err) throw err;
    findData(db,(result)=>{
        // data = Object.assign(data,{readerinfo:result[1]},{book:result[0]});
        console.log(result[0],result[1]);
        res.render('comment',{
          readerinfo:result[1][0],
          book:result[0]
        })
    })
  })
})

router.get('/managerlogin',(req,res)=>{
  res.render('managerlogin')
})
router.get('/manager',(req,res)=>{
  res.send('管理者界面')
})
module.exports = router;
