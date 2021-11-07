// 模型文件，用于后面调用

const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    name: { type: String },
    icon: { type: String },
})

module.exports = mongoose.model('Item', schema)