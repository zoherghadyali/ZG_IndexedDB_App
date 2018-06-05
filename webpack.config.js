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
      plugins:[
        new HTMLWebpackPlugin({
            template: './src/index.html',
            filename: '../../index.html'
        })
      ],
    }
  }