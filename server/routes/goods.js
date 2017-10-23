var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Goods = require('../models/goods');
//连接数据库
mongoose.connect('mongodb://localhost:27017/shop');
//连接成功
mongoose.connection.on('connected',function(){
	console.log("Mongodn connected success");
})
//连接失败
mongoose.connection.on('error',function(){
	console.log("Mongodn connected fail");
})
//连接关闭
mongoose.connection.on('disconnected',function(){
	console.log("Mongodn connected disconnected");
})
router.get('/',function(req,res,next){
	res.send('你好，访问goods api')
})
//router.get('/list',function(req,res,nrext){
//	Goods.find({},function(err,doc){
//		if(err){
//			res.json({status:1,mas:err.message})
//		}else{
//			res.json({status:0,msg:'',result:doc})
//		}
//	})
//})
router.get('/list',function(req,res,nrext){
	let sort = req.param('sort');
	let goodsModel = Goods.find({}).sort({'salePrice':sort})
	goodsModel.exec({},function(err,doc){
		if(err){
			res.json({status:1,mas:err.message})
		}else{
			res.json({status:0,msg:'',result:doc})
		}
	})
//	Goods.find({},function(err,doc){
//		if(err){
//			res.json({status:1,mas:err.message})
//		}else{
//			res.json({status:0,msg:'',result:doc})
//		}
//	})
})


module.exports= router;