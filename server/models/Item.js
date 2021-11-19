// 模型文件，用于后面调用

const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String, default: '' },
    star: { type: String, default: '' },
    cate: { type: String, default: '' },
    desc: { type: String, default: '' },
    detail: { type: String, default: '' }
})

module.exports = mongoose.model('Item', schema)