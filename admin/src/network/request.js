import axios from 'axios'
import Vue from 'vue'
import router from '../router/index'

// 进度条
import NProgress from 'nprogress'

// 通用增删改查接口(增加rest字段)
function GUID_req(config) {
  const instance = axios.create({
    // 全局地址
    baseURL: process.env.VUE_APP_API_URL_CRUD || '/admin/api/rest',
    timeout: 5000
  })

  // 添加请求拦截器，发送request请求的时候展示进度条
  instance.interceptors.request.use(config => {
    // 启动进度条
    NProgress.start()
    // 获取token
    const token = sessionStorage.getItem('token')
    if (token) config.headers.Authorization = 'Bearer ' + token
    return config
  }, err => {})

  // 添加拦截器，响应后隐藏进度条
  instance.interceptors.response.use(res => {
    // 隐藏进度条
    NProgress.done()
    return res
  }, err => {
    // 错误处理
    if (err.response.status === 401) {
      Vue.prototype.$message.error(err.response.data.message)
      router.push('/login')
    }
    if (err.response.status === 403) {
      Vue.prototype.$message.error(err.response.data.message)
    }

  })
  return instance(config)

}

//上传接口
function upload(config) {

  const instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL_UPLOAD || '/admin/api/upload',
    timeout: 5000
  })

  // 添加拦截器，校验用户信息，登录后才能上传
  instance.interceptors.request.use(config => {
    const token = sessionStorage.getItem('token')
    if (token) config.headers.Authorization = 'Bearer ' + token
    return config
  }, err => {})

  instance.interceptors.response.use(res => {
    return res
  }, err => {
    // 错误处理
    if (err.response.status === 401) {
      Vue.prototype.$message.error(err.response.data.message)
      router.push('/login')
    }
    if (err.response.status === 403) {
      Vue.prototype.$message.error(err.response.data.message)
    }
  })
  return instance(config)

}

//登录接口
function login(config) {

  const instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL_LOGIN || '/admin/api',
    timeout: 5000
  })

  // 添加请求拦截器，发送request请求的时候展示进度条
  instance.interceptors.request.use(config => {
    NProgress.start()
    return config
  }, err => {})

  instance.interceptors.response.use(res => {
    NProgress.done()
    return res
  }, err => {
    if (err.response.status === 422) Vue.prototype.$message.error(err.response.data.message)
  })
  return instance(config)

}

// 导出
export {
  GUID_req,
  upload,
  login
}