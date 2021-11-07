const express = require("express")

const app = express()

// 跨域模块
app.use(require('cors')())

// post请求返回json文件
app.use(express.json())

require('./plugins/db')(app)
require('./routes/admin')(app)


app.listen(3000, () => {
    console.log('http://localhost:3000');
});