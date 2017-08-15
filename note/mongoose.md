## 首先安装mongoose模块
  *确保已安装node.js和mongodb*
```
  mpn i -D mongoose
``` 

##用express操作mongodb

## 创建一个models文件夹,在里面创建一个goods.js文件
```
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var productSchema = new Schema({
    "productId": String,
    "productName": String,
    "salePrice": Number,
    "productImage": String
  })
  module.exports = mongoose.model("Goods", productSchema);
  
```

## 在路由文件夹里面创建一个goods.js
``` 
  var express = require("express");
  var router = express.Router();
  var mongoose = require("mongoose");
  var Goods = require("../models/goods");
``` 
## 连接数据库
```
  mongoose.connect('mongodb://60.205.209.241/shop');  
  // 当数据连接成功的时候触发
  mongoose.connection.on('connected', function(){
    console.log("Mongodb counected success")
  })
  // 当数据连接失败的时候触发
  mongoose.connection.on('error', function(){
    console.log("Mongodb counected fail")
  })
  // 当数据关闭连接时候触发
  mongoose.connection.on('connected', function(){
    console.log("Mongodb counected success")
  })
  router.get("/list", function(req, res, next){
    let goodModel = Goods.find({}, function(err), docs){
      console.log(docs);
      res.json({
        status: "0",
        result: docs
      })
    })
  })
```
## vue解决后端api跨域
 ###在config下面的index.js修改,添加代理
```
  proxyTable: {
    '/goods' : {
      target: 'http://localhost:3000'
    },
    '/goods/*' : {
      target: 'http://localhost:3000'
    }
  }
```
## 进程管理supervisor 
`npm i -D supervisor`

