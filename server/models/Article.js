// 模型文件，用于后面调用

const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    title: {
        type: String
    },
    cate: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Category'
    }],
    url: {
        type: String
    },
    date: {
        type: String
    },
    content: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Article', schema)