const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  console.log(`Environment: ${isProduction ? "production" : "development"}`);

  return {
    entry: {
      popup: "./src/app/index.tsx",
      background: `./src/background/background.ts`,
      content: "./src/content/content.ts",
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js",
      clean: true,
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.json",
            },
          },
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: `./src/app/index.html`,
        filename: "popup.html",
        chunks: ["popup"],
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: `manifest.json`,
            to: "manifest.json",
          },
          {
            from: "src/icons",
            to: "icons",
            noErrorOnMissing: true,
          },
          {
            from: "README.md",
            to: "README.md",
            noErrorOnMissing: true,
          },
        ],
      }),
    ],
    devtool: isProduction ? false : "cheap-module-source-map",
    optimization: {
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      },
    },
  };
};
