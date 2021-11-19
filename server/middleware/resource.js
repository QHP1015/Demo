// 资源中间件
module.exports = options => {
    return async(req, res, next) => {
        // 通过使用中间件，在调用之前执行这个方法
        // 格式化名称，不然前端访问不到数据
        const modelName = require('inflection').classify(req.params.resource)

        // 测试是否转换成功
        // return res.send({ modelName })

        req.Model = require(`../models/${modelName}`)
        next();
    }
}