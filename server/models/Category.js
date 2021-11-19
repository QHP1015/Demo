// 模型文件，用于后面调用

const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    name: {
        type: String
    },
    // 类型用mongodb的对象ID————数据库里的ObjectId
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    desc: {
        type: String
    },
})

schema.virtual('children', {
    localField: '_id', // 本地键
    foreignField: 'parent', // 外部键
    justOne: false, // 是否返回单条数据
    ref: 'Category' // 参考模型
})

module.exports = mongoose.model('Category', schema)