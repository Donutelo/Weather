// webpack.dev.js
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devServer: {
    static: "./dist",
    port: 8080,
    host: "0.0.0.0",
    hot: true,
    allowedHosts: "all",
    watchFiles: ["./src/index.html"],
    client: {
      webSocketURL: "wss://some-strange-name8080.app.github.dev/ws"
    }
  },
});
