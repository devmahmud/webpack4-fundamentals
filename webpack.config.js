const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, { mode }) => {
  console.log(mode); // this way you can see what mode is
  return {
    mode,
    output: {
      filename: 'bundle.js',
    },
    plugins: [new HtmlWebpackPlugin(), new webpack.ProgressPlugin()],
  };
};
