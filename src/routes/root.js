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
        book.insert({id:id,summary:summary,author_intro:author_intro,title:title,author:author,price:price,publisher:publisher,isbn10:isbn10,pubdate:pubdate});
        res.send("1");
    })
})
//管理图书信息
router.get('/booksinfo',(req,res)=>{
    var pagecount = 10;//每页的数据量
    var pagetotal = 0;//总页数
    var pageNo = req.query["pageNo"];   
    pageNo = pageNo?parseInt(pageNo):1;
    var count = 0;
    console.log("hhhhhhhhhhhhhhhhhhhhhhhhh")
    var findData = function(db,callback){
        var book = db.collection('book');
        async.waterfall([
            function(callback){
                book.find({},{_id:0,id:1,isbn10:1,title:1,author:1}).toArray((err,result)=>{
                   count = result.length;//总数据量60
                   if(count>=1){
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
   if(count>0){
        var pagecount = 10;//每页的数据量
        var pagetotal = 0;//总页数
        var pageNo = req.query["pageNo"];    
        pageNo = pageNo?parseInt(pageNo):1;
        var count = 0;
        var findData = function(db,callback){
        var readerinfo = db.collection('readerinfo');
        async.waterfall([
            function(callback){
                readerinfo.find({},{_id:0,id:1,username:1,password:1,date:1}).toArray((err,result)=>{
                   count = result.length;
                   if(count>=1){
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
           db.close();
        })   
        
    })
   }else{
       console.log("#######################")
       res.render("readersinfo",{
            result:[{id:"暂无数据...",username:"暂无数据...",password:"暂无数据...",date:"暂无数据..."}],
            count:0,
            pageNo:1,
            pagetotal:1,
            pagecount:10
       })
   }
})

//删除读者信息
router.get('/forbidden',(req,res)=>{
    var id = parseInt(req.query.id);
    console.log(id)
    console.log("hujie")
    conn.getDb((err,db)=>{
        if(err) throw err;
        var coll = db.collection('readerinfo');
        coll.deleteOne({id:id});
          res.redirect('/root/readersinfo') ;
    })
})


//删除图书信息
router.get('/delete',(req,res)=>{
    var id = req.query.id;
    conn.getDb((err,db)=>{
        if(err) throw err;
        var coll = db.collection('book');
        coll.deleteOne({id:id});
        res.redirect("/root/booksinfo") 
    })
})

//修改数据库
router.get('/edit',(req,res)=>{
    var result = req.query.id;
    console.log(result)
    res.render('edit',{result})
})
router.post('/modify',(req,res)=>{
    var data = req.body;
    var id = data.id;
    console.log(id)
    var username = data.username;
    var password = data.password;
    var date = data.date;
    var uid = parseInt(req.query.id);
    conn.getDb((err,db)=>{
        if(err) throw err;
        console.log("连接数据库成功")
        db.collection('readerinfo').update({id:uid},{
           $set:{username:username,password:password,date:date}
        })
            res.redirect("/root/readersinfo")
        })
})

var count = function readerCount(){
    conn.getDb((err,db)=>{
        if(err) throw err;
        var readerinfo = db.collection('readerinfo');
        readerinfo.find().toArray((err,result)=>{
            if(err) throw err;
            var readerCount = result.length;
            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
            console.log(readerCount)
            db.close();
            return readerCount;
        })
    })
}();

    

    
module.exports = router;