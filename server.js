const Vue = require('vue')
const express = require('express')
const fs = require('fs')
const { createBundleRenderer } = require('vue-server-renderer')
const setupDevServer = require('./build/setupDevServer')

const server = express()

server.use('/dist', express.static('./dist'))

const isProd = process.env.NODE_ENV === 'production'

let renderer
let onReady
if (isProd) {
  const serverBundle = require('./dist/vue-ssr-server-bundle.json')
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  const template = fs.readFileSync('./index.html', 'utf-8')
  renderer = createBundleRenderer(serverBundle, {
    template,
    clientManifest
  })
} else {
  // 开发模式 -> 监视打包构建 -> 重新生成 Renderer 渲染期
  onReady = setupDevServer(server, (serverBundle, clientManifest, template) => {
    renderer = createBundleRenderer(serverBundle, {
      template,
      clientManifest
    })
  })
}

const render = async (req, res) => {
  try {
    const html = await renderer.renderToString({
      title: 'my-vue-ssr',
      meta: `
        <meta name="description" content="my-vue-ssr" />
      `,
      url: req.url
    })
    res.setHeader('Content-Type', 'text/html; charset=utf8')
    res.end(html)
  } catch (err) {
    res.status(500).end('Internal Server Error')
  }
}

// 服务端路由设置为 *，意味着所有的路由都会进入这里
server.get('*', isProd ? render : async (req, res) => {
  // 等待有了 Renderer 渲染期以后进行渲染
  await onReady
  render(req, res)
} )

server.listen(3000, () => {
  console.log('Server is running at prot 3000')
})

