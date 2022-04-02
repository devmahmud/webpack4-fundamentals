const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const modeConfig = (env) => require(`./build-utils/webpack.${env}`)(env);
const { merge } = require('webpack-merge');

module.exports = (env, { mode, presets } = { mode: 'production', presets: [] }) => {
  return merge(
    {
      mode,
      module: {
        rules: [
          {
            test: /\.(png|jpe?g|gif)$/i,
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: 5000,
                },
              },
            ],
          },
        ],
      },
      plugins: [new HtmlWebpackPlugin(), new webpack.ProgressPlugin()],
    },
    modeConfig(mode)
    // loadPresets({ mode, presets })
  );
};
