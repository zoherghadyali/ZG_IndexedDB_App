var HTMLWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var path = require('path');
var dotenv = require('dotenv').config();

module.exports = options => {
  return {
    entry: './src/public/javascripts/index.js',
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
      path: path.join(__dirname, 'dist\\public\\javascripts'),
      filename: 'bundle.js',
      publicPath: '/javascripts'
    },
    module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              { loader: "style-loader" },
              { loader: "css-loader" }
            ]
          },
          {
            test: /\.html$/,
            use: 'html-loader'
          },
          { 
            test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/, 
            use: [
                  {
                    loader: 'file-loader',
                    options: {
                      outputPath: '../images',
                      publicPath: '/images'
                    }
                  }  
            ]
          },
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: [
                  {
                    loader: 'babel-loader',
                    options: {
                      cacheDirectory: true,
                      presets: ['react']
                    }
                  }
            ]
          },
        ],
      },

      plugins: [
        new HTMLWebpackPlugin({
          template: './src/index.html',
          filename: '../../index.html'
        }),

        new webpack.DefinePlugin({
          'process.env':{
            'BING_SEARCH_API_KEY': JSON.stringify(process.env.BING_SEARCH_API_KEY)
          }
        })
      ],
    }
  }