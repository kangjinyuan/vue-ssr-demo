/**
 * 通用启动入口
 */
import Vue from 'vue'
import VueMeta from 'vue-meta'
import App from './App.vue'
import { createRouter } from '@/router'
import { createStore } from '@/store'

Vue.use(VueMeta)

Vue.mixin({
  metaInfo: {
    titleTemplate: '%s - ssr'
  }
})

// 导出一个工厂函数，用于创建新的应用程序，router 和 store 实例
export function createApp () {
  const router = createRouter()
  const store = createStore()
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })
  return { app, router, store }
}
