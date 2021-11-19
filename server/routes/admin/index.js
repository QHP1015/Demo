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

    // 查询资源列表接口
    router.get('/', async(req, res) => {

        // 查询时有时需要关联查询有时不需要，通过设置setOptions转换为数据
        const queryOptions = {}
        if (req.Model.modelName === 'Category') {
            // 添加关联查询populate，获得的是一个对象，前端可以通过调用对象属性获取值
            queryOptions.populate = 'parent'
        }
        const items = await req.Model.find().setOptions(queryOptions).limit(100)

        res.send(items)
    })

    // 查询资源详情接口
    router.get('/:id', async(req, res) => {
        const model = await req.Model.findById(req.params.id)
        res.send(model)
    })

    // 登录校验中间件
    const authMiddleware = require('../../middleware/auth')

    // 资源中间件
    const resourceMiddleware = require('../../middleware/resource')
        // 创建通用CRUD接口，提供动态参数
    app.use('/admin/api/rest/:resource', /*authMiddleware(), */ resourceMiddleware(), router)

    // express不自带上传文件的功能，借助中间件multer上传  
    const multer = require('multer')
        // 绝对地址
    const upload = multer({
        dest: __dirname + '/../../uploads'
    })

    app.post('/admin/api/upload', /*authMiddleware(),*/ upload.single('file'), async(req, res) => {
        const file = req.file
        file.url = `http://localhost:3000/uploads/${file.filename}`
        res.send(file)
    })

    // 登录接口
    app.post('/admin/api/login', async(req, res) => {
        const {
            username,
            password
        } = req.body

        // 1.根据用户名找用户
        const user = await AdminUser.findOne({
                username
            }).select('+password') // 顺便取出密码

        // 若用户不存在
        assert(user, 422, '用户不存在')

        // if(!user){
        //     return res.status(422).send({
        //         message:'用户不存在'
        //     })
        // }

        // 2.校验密码
        // 若用户存在
        const isValid = require('bcrypt').compareSync(password, user.password)
        assert(isValid, 422, '密码错误')

        // 3.返回token
        const token = jwt.sign({
                id: user._id,
            }, app.get('secret')) // 获取密钥
        res.send({
            token
        })
    })


    // 错误处理
    app.use(async(err, req, res, next) => {
        res.status(err.statusCode || 500).send({
            message: err.message
        })
    })
}