var express = require('express');
var router = express.Router();
var conn = require('../utils/conn.js')
var async = require('async');
var cheerio = require('cheerio');
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

//search搜索 ，读者查询的信息，把信息返回给reader页面
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
  var findData = function(db,callback){
    console.log(bid)
    var book = db.collection('book');
    var readerinfo = db.collection('readerinfo');
    async.series([
      function(callback){
        book.findOne({id:bid},{id:1,summary:1,author_intro:1,title:1,author:1,_id:0,price:1,publisher:1,isbn10:1,pubdate:1,"images.large":1},(err,result)=>{
            //查询图书的数据库
            console.log('查询图书的数据库成功')
            callback(null,result);
        })
      },
      function(callback){
        //获取用户数据库
        readerinfo.find({username:username},{username:1,date:1,_id:0,id:1}).toArray((err,result)=>{
          console.log('获取用户数据库成功');
          callback(null,result)
        })
      }
    ],
      function(err,result){
        console.log('获取成功')
        callback(result);
    })
  }

  //分割线############################################################
  conn.getDb((err,db)=>{
    if(err) throw err;
    var comment = db.collection('comment');
    comment.find({},{_id:0}).toArray((err,result)=>{
      if(err) throw err;
      console.log("********************")
      var temp = result;
      console.log(temp)
      var len = result.length;
      if(len>=0){
            findData(db,(result)=>{
                //data = Object.assign(data,{readerinfo:result[1]},{book:result[0]});
                res.render('comment',{
                  readerinfo:result[1][0],
                  book:result[0],
                  text:temp,
                  flag:true
                })
            })
      }else{
        findData(db,(result)=>{
            //data = Object.assign(data,{readerinfo:result[1]},{book:result[0]});
            res.render('comment',{
              readerinfo:result[1][0],
              book:result[0],
              flag:false
            })
        })
      }
    })
  })
  
})

router.get("/hhh",(req,res)=>{
  var username = req.session.username;
    var content = req.query.content;
    conn.getDb((err,db)=>{
      if(err) throw err;
      var comment = db.collection("comment");
      var readerinfo = db.collection("readerinfo");
      readerinfo.find({username:username},{username:1,_id:0,id:1,date:1}).toArray((err,result)=>{
        if(err) throw err; 
        var id = result[0].id;
        comment.insert({content:content,id:id,username:result[0].username,date:result[0].date})
        res.send({
          result:result[0],
          content:content
        });
      })
    })
})

router.get('/managerlogin',(req,res)=>{
  res.render('managerlogin')
})
router.get('/manager',(req,res)=>{
  res.render('manager')
})



module.exports = router;



