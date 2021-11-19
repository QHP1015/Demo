module.exports = app => {
    const express = require('express')
    const assert = require('http-assert')
    // 定义express的子路由
    const router = express.Router({
        // 合并参数，让子路由继承父路由的参数
        mergeParams: true
    })

    //登录验证中间件
    const auth = require('../../middleware/validateMiddleWear')
    const access = require('../../middleware/access')

    // 通用CRUD接口，提供动态参数
    app.use('/admin/api/rest/:resource', auth(app), async (req, res, next) => {
        // 通过使用中间件，在调用之前执行这个方法

        // 格式化名称，不然前端访问不到数据
        const modelName = require('inflection').classify(req.params.resource)

        // 测试是否转换成功
        // return res.send({ modelName })

        req.Model = require(`../../models/${modelName}`)
        next();
    }, router)


    // 创建接口
    router.post('/', access(app), async (req, res) => {
        try {
            const model = await req.Model.create(req.body)
            res.send(model)
        } catch (error) {
            res.status(400).send({
                message: '传入的参数有误'
            })
        }
    })

    // 更新接口
    router.put('/:id', access(app), async (req, res) => {
        const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
        res.send(model)
    })

    // 删除接口
    router.delete('/:id', access(app), async (req, res) => {
        // 禁止删除有子分类的父级分类
        if (req.Model.modelName === 'Category') {
            const parent = await req.Model.findById(req.params.id)
            const children = await req.Model.aggregate([{
                    $match: {
                        parent: parent._id
                    }
                },
                {
                    $lookup: {
                        from: 'Category',
                        localField: '_id',
                        foreignField: 'cate',
                        as: 'children'
                    }
                }
            ])
            assert(children.length < 1, 403, '无法删除')
        }
        await req.Model.findByIdAndDelete(req.params.id)
        res.send({
            message: '删除成功'
        })
    })

    // 查询资源列表接口
    router.get('/', async (req, res, next) => {
        // 实现分页效果
        if (!(req.query.pagenum || req.query.pagesize)) return next()
        const pagenum = Number(req.query.pagenum)
        const pagesize = Number(req.query.pagesize)
        const skipNum = (pagenum - 1) * pagesize
        const total = await req.Model.countDocuments()
        let data
        if (req.query.query) {
            data = await req.Model.find({
                name: req.query.query
            }).skip(skipNum).limit(pagesize).populate('cate')
        } else {
            data = await req.Model.find().skip(skipNum).limit(pagesize).populate('cate')
        }
        res.send({
            total,
            data
        })

    }, async (req, res) => {
        if (req.Model.modelName === 'Category') {
            const parents = await req.Model.find().where({
                parent: null
            }).lean()

            for (let i = 0; i < parents.length; i++) {
                parents[i].children = await req.Model.aggregate([{
                        $match: {
                            parent: parents[i]._id
                        }
                    },
                    {
                        $lookup: {
                            from: 'Category',
                            localField: '_id',
                            foreignField: 'parent',
                            as: 'children'
                        }
                    }
                ])
                const lenth = parents[i].children.length
                for (let j = 0; j < lenth; j++) {
                    (parents[i].children)[j].children = await req.Model.aggregate([{
                            $match: {
                                parent: (parents[i].children)[j]._id
                            }
                        },
                        {
                            $lookup: {
                                from: 'Category',
                                localField: '_id',
                                foreignField: 'parent',
                                as: 'children'
                            }
                        }
                    ])
                }
            }
            return res.send(parents)
        }
        const queryOptions = {}
        if (req.Model.modelName === 'Article') {
            queryOptions.populate = 'cate'
        }
        if (req.Model.modelName === 'Hero') {
            if (req.query.query) {
                const model = await Hero.find({
                    name: req.query.query
                })
                res.send(model)
            } else {
                const model = await req.Model.find().setOptions(queryOptions)
                return res.send(model)
            }
        }
        const model = await req.Model.find().setOptions(queryOptions)
        res.send(model)
    })

    // 查询资源详情接口
    router.get('/:id', async (req, res) => {
        const model = await req.Model.findById(req.params.id)
        res.send(model)
    })
}