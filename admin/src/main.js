import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router'

// 树形表格
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

// 进度条
import 'nprogress/nprogress.css'


Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')