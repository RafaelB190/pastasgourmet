const path = require("path");

module.exports = {
  entry: "./index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname),
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/image/[name][ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
    fallback: {
      fs: false,
      path: false,
      os: false,
    },
    alias: {
      "~": path.resolve(__dirname, "node_modules/tailwindcss"),
    },
  },
  experiments: {
    outputModule: true,
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname),
    publicPath: "/",
    module: true,
  },
  resolve: {
    fullySpecified: false,
  },
  devServer: {
    static: path.join(__dirname),
    compress: true,
    port: 9002,
    hot: true,
    open: true,
  },
};
