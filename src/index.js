import { createRouter, createWebHistory } from 'vue-router'

const components = import.meta.glob('./components/*.vue')

import Home from './components/HelloWorld.vue'
import Incomes from './components/Incomes.vue'
import Stocks from './components/Stocks.vue'
import Orders from './components/Orders.vue'
import Sales from './components/Sales.vue'
import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs'

const token = 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie';
const baseUrl = 'http://109.73.206.144:6969/api/';

const routes = [
    {path: '/', name: 'home', component: Home, props: { token, baseUrl }},
    {path: '/incomes', name: 'incomes', component: Incomes, props: { token, baseUrl }},
    {path: '/stocks', name: 'stocks', component: Stocks},
    {path: '/orders', name: 'orders', component: Orders, props: { token, baseUrl }},
    {path: '/sales', name: 'sales', component: Sales, props: { token, baseUrl }}
]

// const currentPath = ref(window.location.hash)

// const routes = Object.keys(components).map((path) => {
//     const name = path
//         .replace('./components/', '')
//         .replace('.vue', '')
//         .toLowerCase()
//     return {
//         path: `/${name}`,
//         name,
//         component: components[path],
//         props: { token, baseUrl }
//     }
// })

routes.unshift({
    path: '/',
    name: 'home',
    component: components['./components/HelloWorld.vue']
});

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router