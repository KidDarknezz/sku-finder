module.exports = {
  chainWebpack: config => {
    config.performance.maxEntrypointSize(400000).maxAssetSize(400000)
  },
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false,
    },
  },
  transpileDependencies: ['quasar'],
}
