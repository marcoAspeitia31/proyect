const path = require('path');

module.exports = {
  transpileDependencies: [],
  publicPath: "/sk-back-end/",
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // Agregar alias para 'src'
      },
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'), // Agregado para stream
      },
    },
  },
};
