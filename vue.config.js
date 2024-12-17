const path = require("path");
const webpack = require("webpack");

module.exports = {
  transpileDependencies: [],
  publicPath: "/sk-back-end/",
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"), // Agregar alias para 'src'
      },
      fallback: {
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        "vm": require.resolve("vm-browserify")
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: true, // Habilita la API de Opciones
        __VUE_PROD_DEVTOOLS__: false, // Deshabilita Devtools en producción
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false, // Desactiva detalles de hidratación
      }),
    ],
  },
};
