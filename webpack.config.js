const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
  // Determine mode: popup (default) or sidepanel
  const mode = env.MODE || "popup";
  const isProduction = argv.mode === "production";

  console.log(`Building for mode: ${mode}`);
  console.log(`Environment: ${isProduction ? "production" : "development"}`);

  return {
    entry: {
      popup: "./src/popup/index.tsx",
      background: `./src/background/background.${mode}.ts`,
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
        template: `./src/popup/popup.${mode}.html`,
        filename: "popup.html",
        chunks: ["popup"],
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: `./configs/manifest.${mode}.json`,
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
