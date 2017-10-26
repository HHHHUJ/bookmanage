1.豆瓣API:https://api.douban.com/v2/book/search?q=a
http://jquery.cuishifeng.cn/

2.LiveReloaz自动刷新页面
3.图书管理系统
    读者：
        id查询 26796411，
        isbn查询 0062407341，
        作者查询 Amy, M.D. Tuteur,
        书名查询 General Theory of Interpretation
        借还图书
        评论区
        在线读者实时聊天
        其他功能无权限
    管理者：
        新书入库
        借还信息处理(逾期未还则累计时间罚款)
        读取读者信息
        修改删除评论

4.数据库：bookmanage
    collections:readerinfo,managerinfo,bookinfo

5.//1. 启动本地服务
var webserver = require("gulp-webserver");
// mock数据 模拟   json数据
gulp.task("webserver",function(){
	gulp.src("./")      //表示当前文件夹
	.pipe(webserver({
		livereload:true,    // 浏览器自动刷新，更新数据，类似热替换
		port:8000,          // 自定义端口号
		host:"192.168.71.107",    // 主机,可以更换成电脑IP
		directoryListing:{   // 要不要在浏览器中显示你开发环境得项目目录,便于开发使用，如果上线，就必须设置为false
			enable:true ,     //true 显示 默认false
			path:"./"         //作用的文件目录范围
		}
	}))
})

6.建立索引
    {
   "address": {
      "city": "Los Angeles",
      "state": "California",
      "pincode": "123"
   },
   "tags": [
      "music",
      "cricket",
      "blogs"
   ],
   "name": "Tom Benzamin"
}

db.users.ensureIndex({"address.city":1,"address.state":1,"address.pincode":1})

db.users.find({"address.city":"Los Angeles"})   顺序要一致

完全匹配
    db.col_content.find({'nodeID':{$in:['7788']}})
正则
    db.collection.find( { sku: /adC/i } );等效于下面这种写法
    db.collection.find( { sku: { $regex: 'abC', $options: 'i' } } );
        option参数:1.i 忽略大小写 2.m：用来匹配value中有换行符(\n)的情形。
            还有一个情形是：匹配规则中使用了锚,所谓的锚就是^ 开头, $ 结束；
            3.参数 s ===== 允许点字符（.）匹配所有的字符，包括换行符。
            db.products.find( { description: { $regex: /m.*line/, $options: 'si' } } ) 
            4.参数 x ====== 官网的大意是忽视空白字符。

