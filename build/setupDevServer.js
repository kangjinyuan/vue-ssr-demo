const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const webpack = require('webpack')
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')

const resolve = file => path.resolve(__dirname, file)

module.exports = (server, callback) => {
  let ready
  const onReady = new Promise(resolve => {
    ready = resolve
  })

  // 监视构建 -> 跟新 Renderer 渲染器
  let template
  let serverBundle
  let clientManifest

  const update = () => {
    if (template && serverBundle && clientManifest) {
      ready()
      callback(serverBundle, clientManifest, template)
    }
  }

  // 监视构建 template -> 调用 update -> 更新 Renderer 渲染器
  const templatePath = resolve('../index.html')
  template = fs.readFileSync(templatePath, 'utf-8')
  update()
  chokidar.watch(templatePath).on('change', () => {
    update()
  })
  // 监视构建 serverBundle -> 调用 update -> 更新 Renderer 渲染器
  const serverConfig = require('./webpack.server.config')
  const serverCompiler = webpack(serverConfig)
  const serverDevMiddleware = devMiddleware(serverCompiler, {
    logLevel: 'silent'
  })
  serverCompiler.hooks.done.tap('serverCompiler', () => {
    const serverBundlePath = resolve('../dist/vue-ssr-server-bundle.json')
    serverBundle = JSON.parse(serverDevMiddleware.fileSystem.readFileSync(serverBundlePath, 'utf-8'))
    update()
  })
  // 监视构建 clientManifest -> 调用 update -> 更新 Renderer 渲染器
  const clientConfig = require('./webpack.client.config')
  clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
  clientConfig.entry.app = [
    'webpack-hot-middleware/client?quiet=true&reload=true', // 和服务端交互处理热更新的客户端脚本
    clientConfig.entry.app
  ]
  clientConfig.output.filename = '[name].js' // 热更新模式下确保一致的 hash
  const clientCompiler = webpack(clientConfig)
  const clientDevMiddleware = devMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    logLevel: 'silent'
  })
  clientCompiler.hooks.done.tap('clientCompiler', () => {
    const clientManifestPath = resolve('../dist/vue-ssr-client-manifest.json')
    clientManifest = JSON.parse(clientDevMiddleware.fileSystem.readFileSync(clientManifestPath, 'utf-8'))
    update()
  })

  server.use(hotMiddleware(clientCompiler, {
    log: false // 关闭日志输出
  }))

  // 将 clientDevMiddleware 挂载到 express 服务中，提供对其内部内存中数据的访问 
  server.use(clientDevMiddleware)

  return onReady
}