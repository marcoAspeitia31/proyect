const path = require('path');

module.exports = {
  transpileDependencies: [],
  publicPath: "/SK-backend/",
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
