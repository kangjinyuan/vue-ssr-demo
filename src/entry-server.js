/**
 * 服务端入口
 */

import { createApp } from './app'

export default async context => {
  const { app, router, store } = createApp()
  const meta = app.$meta()
  // 设置服务端 router 位置
  router.push(context.url)
  context.meta = meta
  // 等到 router 将可能的异步组件和钩子函数解析完
  await new Promise(router.onReady.bind(router))
  // 在服务端渲染完毕之后被调用
  context.rendered = () => {
    // Renderer 会把 context.state 数据对象内联到页面模板中
    // 最终发送给客户端的页面中会包含一段脚本 window.__INITIAL_STATE__ = context.state
    // 客户端就要把页面中的 window.__INITIAL_STATE__ 拿出来填充到客户端的 store 容器中
    context.state = store.state
  }
  return app
}
