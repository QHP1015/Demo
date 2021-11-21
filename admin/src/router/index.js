import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/login',
    component: () => import('../views/Login.vue'),
    meta: {
        noRequiredAuth: true
    }
}, {
    path: '/',
    name: 'main',
    component: Main,
    // 子路由
    children: [
        //分类
        {
            path: 'category',
            component: () => import('../views/Category.vue')
        },

        //物品
        {
            path: 'item',
            component: () => import('../views/Item.vue')
        },

        //英雄
        {
            path: 'hero/create',
            component: () => import('../views/hero/HeroEdit.vue')
        },
        {
            path: 'hero/edit/:id',
            component: () => import('../views/hero/HeroEdit.vue'),
            props: true
        },
        {
            path: 'hero/list',
            component: () => import('../views/hero/HeroList.vue')
        },

        //文章
        {
            path: 'article/create',
            component: () => import('../views/article/ArticleEdit.vue')
        },
        {
            path: 'article/edit/:id',
            component: () => import('../views/article/ArticleEdit.vue'),
            props: true
        },
        {
            path: 'article/list',
            component: () => import('../views/article/ArticleList.vue')
        },

        //广告位
        {
            path: 'ad/list',
            component: () => import('../views/AdList.vue')
        },

        //用户
        {
            path: 'admin_user/list',
            component: () => import('../views/AdminUserList.vue')
        }
    ]
}, ]

const router = new VueRouter({
    mode: 'history',
    routes
})

// 导航守卫，路由限制
router.beforeEach((to, from, next) => {
    if (!to.meta.noRequiredAuth && !sessionStorage.token) {
        return next('/login')
    }
    return next()
})

export default router