import { createRouter, createWebHistory } from 'vue-router'

const components = import.meta.glob('./components/*.vue')

const token = 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie';
const baseUrl = 'https://109.73.206.144:6969/api/incomes';

const routes = Object.keys(components).map((path) => {
    const name = path
        .replace('./components/', '')
        .replace('.vue', '')
        .toLowerCase()
    return {
        path: `/${name}`,
        name,
        component: components[path],
        props: { token, baseUrl }
    }
})

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