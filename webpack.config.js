const path = require('path');
const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const APP_DIR = fs.realpathSync(process.cwd());

const resolveAppPath = relativePath => path.resolve(APP_DIR, relativePath);

module.exports = {
  entry: resolveAppPath('src'),
  output: {
    filename: 'recogito-mrm-ui.js'
  },
  performance: {
    hints: false
  },
  devtool: 'source-map',
  optimization: {
    minimize: true
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      'react': path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom')
    }
  },
  module: {
    rules: [
      { 
        test: /\.(js|jsx)$/, 
        use: { 
          loader: 'babel-loader' ,
          options: {
            "presets": [
              "@babel/preset-env",
              "@babel/preset-react"
            ],
            "plugins": [
              [
                "@babel/plugin-proposal-class-properties"
              ]
            ]
          }
        }
      },
      { test: /\.css$/,  use: [ MiniCssExtractPlugin.loader, 'css-loader'] },
      { test: /\.scss$/, use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ] }
    ]
  },
  devServer: {
    contentBase: resolveAppPath('public'),
    compress: true,
    hot: true,
    host: process.env.HOST || 'localhost',
    port: 3000,
    publicPath: '/',
    proxy: {
      '/api': 'http://localhost:9000',
      '/assets': 'http://localhost:9000',
      '/document': 'http://localhost:9000',
      '/webjars': 'http://localhost:9000'
    }
  },
  plugins: [
    new HtmlWebpackPlugin ({
      inject: 'head',
      template: resolveAppPath('public/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: 'recogito-mrm-ui.css',
    })
  ]
}