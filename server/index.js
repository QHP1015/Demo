const express = require("express")
const app = express()
const multer = require('multer')

// 全局密钥
app.set('secret', 'qianhaipeng20011015')

// 跨域模块
app.use(require('cors')())

// post请求返回json文件
app.use(express.json())

// 静态路由，用于托管文件
app.use('/wzry', express.static(__dirname + '/web'))
app.use('/wzry/back', express.static(__dirname + '/admin'))
app.use('/uploads', express.static(__dirname + '/uploads'))

// 连接数据库
require('./plugins/db')(app)
// 后台管理 CRUD 接口
require('./routes/admin/index')(app)
//图片上传接口
require('./routes/admin/imgUpload')(app, multer)
//登录接口
require('./routes/admin/login')(app)

//前端页面请求数据接口
// require('./routes/web/init')(app)// 初始化数据
require('./routes/web/index')(app)
require('./routes/web/strategy')(app)
require('./routes/web/race')(app)
require('./routes/web/common')(app)

// 监听服务器其他错误
app.use((err, req, res, next) => {
    if (!err.statusCode) return res.status(500).send({
        message: err.message
    })
    res.status(err.statusCode).send({
        message: err.message
    })
})


app.listen(3333, () => {
    console.log('http://localhost:3333');
});