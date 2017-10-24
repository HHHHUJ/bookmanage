var express = require('express');
var router = express.Router();

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
  res.send('读者界面')
})
router.get('/managerlogin',(req,res)=>{
  res.render('managerlogin')
})
router.get('/manager',(req,res)=>{
  res.send('管理者界面')
})
module.exports = router;
