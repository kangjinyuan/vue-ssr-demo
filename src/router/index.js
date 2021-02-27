import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    name: 'home',
    path: '/',
    component: () => import(/* webpackChunkName: 'home' */ '@/views/Home.vue')
  },
  {
    name: 'about',
    path: '/about',
    component: () => import(/* webpackChunkName: 'about' */ '@/views/About.vue')
  },
  {
    name: 'post',
    path: '/post',
    component: () => import(/* webpackChunkName: 'post' */ '@/views/Post.vue')
  },
  {
    name: 'error404',
    path: '*',
    component: () => import(/* webpackChunkName: '404' */ '@/views/404.vue')
  }
]

export const createRouter = () => {
  const router = new VueRouter({
    mode: 'history', // 兼容前后端
    routes
  })
  return router
}