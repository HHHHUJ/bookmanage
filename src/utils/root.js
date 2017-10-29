var conn = require('./conn');
var fn = {
    infoCount:function (arg,callback){
        conn.getDb((err,db)=>{
            if(err) throw err;
            var coll = db.collection(arg);
            coll.find({}).toArray((err,result)=>{
                if(err) throw err;
                count = result.length;
                callback(count)
            })
        })
    }
}
module.exports={
    fn:fn
}