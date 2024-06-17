const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              process.env.NODE_ENV === 'development' && require.resolve('react-refresh/babel')
            ].filter(Boolean)
          }
        }
      },
      // Add other rules as needed, e.g., for CSS, images, etc.
    ]
  },
  plugins: [
    process.env.NODE_ENV === 'development' && new ReactRefreshWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ].filter(Boolean),
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    hot: true
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
