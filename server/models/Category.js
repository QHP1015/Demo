// 模型文件，用于后面调用

const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    name: { type: String },
    // 类型用mongodb的对象ID————数据库里的ObjectId
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
})

schema.virtual('children',{
    localField:'_id',
    foreignField:'parent',
    justOne:false,
    ref:'Category'
})

schema.virtual('newsList',{
    localField:'_id',
    foreignField:'categories',
    justOne:false,
    ref:'Article'
})

module.exports = mongoose.model('Category', schema)