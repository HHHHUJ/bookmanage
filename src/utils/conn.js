//封装连接数据库
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var CONN_DB_STR = "mongodb://localhost:27017/bookmanage";

module.exports = {
    getDb:function(callback){
        MongoClient.connect(CONN_DB_STR,(err,db)=>{
            if(err){
                callback(err,null);
            }else{
                callback(null,db);
            }
        })
    }
}
