var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Goods = require('../models/goods');
var User = require('../models/user');
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

router.get('/list',function(req,res,nrext){
	let sort = req.param('sort');
	let pramLevel = req.param('pramLevel');
	let pram = {};
	let pramGt = '';
	let pramLte = '';
	let currentPage = parseInt(req.param('currentPage')) > 0 ? parseInt(req.param('currentPage')) : 1;
	let pageSize = parseInt(req.param('pageSize')) > 0 ? parseInt(req.param('pageSize')) : 8;
	let skip = (currentPage -1 ) * pageSize;
	if (pramLevel != 'all') {
		switch (pramLevel){
			case '0':
				pramGt = 0;
				pramLte = 100;
				break;
			case '1':
				pramGt = 100;
				pramLte = 500;
				break;
			case '2':
				pramGt = 500;
				pramLte = 1000;
				break;
			case '3':
				pramGt = 1000;
				pramLte = 2000;
				break;
			
		}
		pram = {
				salePrice: {
					$gt: pramGt,
					$lte: pramLte
				}
			}
	}

	let goodsModel = Goods.find(pram).sort({'salePrice':sort}).skip(skip).limit(pageSize);
	goodsModel.exec({},function(err,doc){
		if(err){
			res.json({status:1,mas:err.message})
		}else{
			res.json({status:0,msg:'',result:doc})
		}
	})

})

router.post('/addCart',function(req,res,next){
	var productId = req.body.productId;
	
	var userId = req.cookies.userId;	
	User.findOne({userId:userId},function(err,userDoc){
		
		let goodItem = '';
		userDoc.cartList.forEach(function(item){
			if (item.productId == productId) {
				goodItem = item;
				item.productNum++;
			}
		})
		if (goodItem) {
			userDoc.save(function(err2,doc2){
				if (err2) {
					res.json({status:'1',msg:err2.message})
				}else{
					res.json({status:'0',msg:'',result:'商品数量添加成功'})
				}
			})
		}else{
			Goods.findOne({'productId':productId},function(err,goodsDoc){
				goodsDoc.productNum =1;
				goodsDoc.checked = 0;
				userDoc.cartList.push(goodsDoc)
				userDoc.save(function(err2,doc2){
					res.json({
						status: '0',
						msg: '',
						result: '加入购物车'
					})
				})
			})
		}
			
//		res.json({
//			data: userDoc
//		})
	})
})

router.get('/cartList',function(req,res,next){
	var userId = req.cookies.userId;
	User.findOne({userId:userId},function(err,doc){
		if (err) {
			res.json({
				status: '1',
				msg: err.message,
				resule:''
			})
		}else{
			res.json({
				status: '0',
				msg:'',
				result: doc
			})
		}
			
	})
})

module.exports= router;