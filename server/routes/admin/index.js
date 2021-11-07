module.exports = app => {
    const express = require('express')

    // 定义express的子路由
    const router = express.Router({
        // 合并参数，让子路由继承父路由的参数
        mergeParams: true
    })


    // 创建接口
    router.post('/', async(req, res) => {
        const model = await req.Model.create(req.body)

        // 发回客户端，让客户端知晓已经创建完成，同时返回创建的数据
        res.send(model)
    })

    // 更新接口
    router.put('/:id', async(req, res) => {
        const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
        res.send(model)
    })

    // 删除接口
    router.delete('/:id', async(req, res) => {
        await req.Model.findByIdAndDelete(req.params.id, req.body)
        res.send({
            success: true
        })
    })

    // 查询接口
    router.get('/', async(req, res) => {

        // 查询时有时需要关联查询有时不需要，通过设置setOptions转换为数据
        const queryOptions = {}
        if (req.Model.modelName === 'Category') {
            // 添加关联查询populate，获得的是一个对象，前端可以通过调用对象属性获取值
            queryOptions.populate = 'parent'
        }
        const items = await req.Model.find().setOptions(queryOptions).limit(10)

        res.send(items)
    })

    router.get('/:id', async(req, res) => {
        const model = await req.Model.findById(req.params.id)
        res.send(model)
    })

    // 创建通用CRUD接口，提供动态参数
    app.use('/admin/api/rest/:resource', async(req, res, next) => {
        // 通过使用中间件，在调用之前执行这个方法

        // 格式化名称，不然前端访问不到数据
        const modelName = require('inflection').classify(req.params.resource)

        // 测试是否转换成功
        // return res.send({ modelName })

        req.Model = require(`../../models/${modelName}`)
        next();
    }, router)
}