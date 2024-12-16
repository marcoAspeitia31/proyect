const path = require("path");
const webpack = require("webpack");

module.exports = {
  transpileDependencies: [],
  publicPath: "/sk-back-end/",
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"), 
      },
      fallback: {
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        "vm": require.resolve("vm-browserify")
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false, 
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
      }),
    ],
  },
};
