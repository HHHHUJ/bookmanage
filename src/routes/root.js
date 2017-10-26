var express = require("express");
var router = express.Router();
var async = require("async");
var conn = require("../utils/conn");   // 引用关系不变
var multiparty = require("multiparty");
var fs = require("fs");

//进入新书入库界面
router.get('/addbooks',(req,res)=>{
    res.render('addbooks')
})

//处理书籍信息入库操作
router.post('/addABook',(req,res)=>{
    var data = req.body;
    var title = data.title;
    var author = data.author;
    var id = data.id;
    var isbn10 = data.isbn10;
    var summary = data.content;
    var price = data.price;
    var author_intro = data.author_intro;
    var pubdate = data.pubdate;
    var publisher = data.publisher;
    conn.getDb((err,db)=>{
        if(err) throw err;
        var book = db.collection('book');
        book.insert({_id:0,id:1,summary:1,author_intro:1,title:1,author:1,price:1,publisher:1,isbn10:1,pubdate:1});
        res.send("1");
    })
})
//管理图书信息
router.get('/booksinfo',(req,res)=>{
    var pagecount = 10;//每页的数据量
    var pagetotal = 0;//总页数
    var pageNo = req.query["pageNo"]; 
    console.log(pageNo);    
    pageNo = pageNo?parseInt(pageNo):1;
    var count = 0;
    var findData = function(db,callback){
        var book = db.collection('book');
        async.waterfall([
            function(callback){
                book.find({},{_id:0,id:1,isbn10:1,title:1,author:1}).toArray((err,result)=>{
                   count = result.length;//总数据量60
                   if(count>1){
                        pagetotal = Math.ceil(count/pagecount);//6
                        pageNo = pageNo<=1?1:pageNo;
                        pageNo = pageNo>=pagetotal?pagetotal:pageNo;
                        callback(null,true);
                   }else{
                       callback(null,false)
                   }
                })
            },
            function(flag,callback){
                if(flag){
                    book.find({},{_id:0,id:1,isbn10:1,title:1,author:1}).sort({_id:-1}).skip((pageNo-1)*pagecount).limit(pagecount).toArray((err,result)=>{
                        if(err) throw err;
                        console.log("查询当前pageNo 数据成功");
                        console.log(result);
                        callback(null,result);
                    })
                }else{
                    callback(null,false);
                } 
            }
        ],function(err,result){
            callback(result);
        })
    }
    conn.getDb((err,db)=>{
        if(err) throw err;
        findData(db,(result)=>{
            res.render('booksinfo',{
               result:result,
               count:count,
               pageNo:pageNo,
               pagetotal:pagetotal,
               pagecount:pagecount
           })
        })
           
    })
})

//读者信息
router.get('/readersinfo',(req,res)=>{
    var pagecount = 10;//每页的数据量
    var pagetotal = 0;//总页数
    var pageNo = req.query["pageNo"]; 
    console.log(pageNo);    
    pageNo = pageNo?parseInt(pageNo):1;
    var count = 0;
    var findData = function(db,callback){
        var readerinfo = db.collection('readerinfo');
        async.waterfall([
            function(callback){
                readerinfo.find({},{_id:0,id:1,username:1,password:1,date:1}).toArray((err,result)=>{
                   count = result.length;
                   if(count>1){
                        pagetotal = Math.ceil(count/pagecount);
                        pageNo = pageNo<=1?1:pageNo;
                        pageNo = pageNo>=pagetotal?pagetotal:pageNo;
                        callback(null,true);
                   }else{
                       callback(null,false)
                   }
                })
            },
            function(flag,callback){
                if(flag){
                    readerinfo.find({},{_id:0,id:1,username:1,password:1,date:1}).sort({_id:-1}).skip((pageNo-1)*pagecount).limit(pagecount).toArray((err,result)=>{
                        if(err) throw err;
                        console.log("查询当前pageNo 数据成功");
                        console.log(result);
                        callback(null,result);
                    })
                }else{
                    callback(null,false);
                } 
            }
        ],function(err,result){
            callback(result);
        })
    }
    conn.getDb((err,db)=>{
        if(err) throw err;
        findData(db,(result)=>{
            res.render('readersinfo',{
               result:result,
               count:count,
               pageNo:pageNo,
               pagetotal:pagetotal,
               pagecount:pagecount
           })
        })
           
    })
})



module.exports = router;