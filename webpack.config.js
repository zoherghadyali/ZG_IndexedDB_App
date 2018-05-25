var HTMLWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = options => {
  return {
    entry: './src/public/javascripts/index.js',
    mode: 'development',
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
              {
                loader: "style-loader",
                options: {
                  name:'[name].[ext]',
                  outputPath: '../stylesheets',
                  publicPath: '/stylesheets'
                } 
              },
              { loader: "css-loader" },
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
                      name: '[name].[ext]',
                      outputPath: '../images',
                      publicPath: '/images'
                    }
                  }
            ]
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  cacheDirectory: true,
                },
              },
            ],
          },
        ],
      },
      plugins:[
        new HTMLWebpackPlugin({
            template: './src/index.html',
            filename: '../../index.html'
        })
      ],
    }
  }