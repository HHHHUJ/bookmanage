1.豆瓣API:https://api.douban.com/v2/book/search?q=a
2.LiveReloaz自动刷新页面
3.图书管理系统
    读者：
        id查询，isbn查询，作者查询
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
