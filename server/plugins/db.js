module.exports = app => {
    const mongoose = require("mongoose")
        // 连接数据库
    mongoose.connect('mongodb://127.0.0.1:27017/demo', {
        // 避免“不建议使用当前URL字符串解析器”警告
        useNewUrlParser: true
    })
}