// webpack.dev.js
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

const hostname = process.env.CODESPACE_NAME
  ? `${process.env.CODESPACE_NAME}-8080.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`
  : "localhost";

module.exports = merge(common, {
  mode: "development",
  devServer: {
    static: "./dist",
    port: 8080,
    host: "0.0.0.0",
    hot: true,
    allowedHosts: "all",
    historyApiFallback: true,
    client: {
      webSocketURL: {
        hostname: hostname,
        pathname: "/ws",
        port: 443,
        protocol: "wss",
      },
      logging: "verbose",
    },

    watchFiles: {
      paths: ["./src/**/*"],
      options: {
        usePolling: true,
        interval: 300,
      },
    },
  },
});
