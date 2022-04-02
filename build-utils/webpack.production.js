const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => ({
  plugins: [new MiniCssExtractPlugin()],
  output: {
    filename: '[chunkhash].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
});
