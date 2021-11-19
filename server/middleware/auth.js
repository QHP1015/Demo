// 登录校验中间件
module.exports = options => {
    const jwt = require('jsonwebtoken')
    const assert = require('http-assert')
    const AdminUser = require('../models/AdminUser')
    return async(req, res, next) => {
        // 添加中间件，校验用户是否登录
        const token = String(req.headers.authorization || '').split(' ').pop()
        assert(token, 401, '请提供jwt token')
        const {
            id
        } = jwt.verify(token, req.app.get('secret'))
        assert(id, 401, '无效的jwt token')
            // 数据库寻找用户id赋给req
        req.user = await AdminUser.findById(id)
        assert(req.user, 401, '请先登录')
        await next()
    }
}