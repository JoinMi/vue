var express = require("express");
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

mongoose.connect('mongodb://60.205.209.241:27017/shop');

mongoose.connection.on('connected', function(){
  console.log("Mongodb connected success")
});

mongoose.connection.on('error', function () {
  console.log("Mongodb connected fail")
});

mongoose.connection.on('disconnected', function () {
  console.log("Mongodb connected disconnected")
});

router.get("/list", function(req, res, next){

  let sort = req.param("sort");
  let page = req.param("page");
  let pagesize = parseInt(req.param("pagesize"));
  let priceLevel = req.param("priceLevel");
  let priceGt = '', priceLte = '';
  let skip = parseInt((page - 1) * pagesize);
  let param = {};
  switch (priceLevel) {
    case 'all': priceGt = 0; priceLte = 4000; break;
    case '0': priceGt = 0; priceLte = 100; break;
    case '1': priceGt = 100; priceLte = 500; break;
    case '2': priceGt = 500; priceLte = 1000; break;
    case '3': priceGt = 1000; priceLte = 2000; break;
    case '4': priceGt = 2000; priceLte = 4000; break;
  }

  param = {
    salePrice: {
      $gt: priceGt,
      $lte: priceLte
    }
  }

  let goodsModel = Goods.find(param).limit(pagesize).skip(skip);
  goodsModel.sort({'salePrice': sort});

  goodsModel.exec({}, function(err, docs){
    res.json({
      status:'0',
      result: docs
    })
  })
});

router.post("/addCart", function(req, res, next){
  if (req.cookies.userId) {
    var userId = req.cookies.userId
  } else {
    res.json({
      status: 1,
      msg: '用户信息不存在'
    })
  }
  var productId = req.body.productId
  if (!productId) {
    return res.json({
      status: '1',
      msg: 'missing paramter'
    })
  }
  var User = require('../models/user');
  User.findOne({userId: userId}, function(err, userDoc){
    let goodItem = ''
    userDoc.cartList.forEach(function(item){
      console.log(item)
      if (item) {
        if (item.productId == productId) {
          console.log(item.productId, productId)
          goodItem = item
          item.productNum++
        }
      }
    })
    if (goodItem) {
      userDoc.save(function(err3, doc3){
        if (err3) {
          res.json({
            status: "1",
            msg: err.message
          })
        } else {
          res.json({
            status: "0",
            result: "添加商品数量成功!"
          })
        }
      })
    } else {
      console.log(productId);
      Goods.findOne({productId: productId}, function (err, goodsDoc) {
        console.log(err);
        console.log(goodsDoc);
        if (!goodsDoc) {
            return res.json({
              status: 1,
              msg: 'data is empty'
            })
          }
          goodsDoc.productNum = 1
          goodsDoc.checked = 1
          userDoc.cartList.push(goodsDoc)
          userDoc.save(function (err2, Doc2) {
            if (err2) {
              res.json({
                status: "1",
                msg: err.message
              })
            } else {
              res.json({
                status: 0,
                msg: "",
                result: "第一次添加购物车!"
              })
            }
          })
      })
    }
  })
})


module.exports = router;
