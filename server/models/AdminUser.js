// 模型文件，用于后面调用

const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    username: { type: String },
    password: {
        type: String,
        select: false,
        // 用户密码散列加密
        set(val) {
          return require('bcryptjs').hashSync(val, 10)
        }
      },
      level: { type: String }
})

module.exports = mongoose.model('AdminUser', schema)