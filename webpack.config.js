const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: require.resolve('jquery'),
        use: [{
            loader: 'expose-loader',
            options: 'jQuery'
        },
         {
            loader: 'expose-loader',
            options: '$'
        }]
    },
      { 
        test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" 
    },
    {
      test: /\.mp4$/,
      use: [{
        loader: 'file-loader?name=/src/images/[name].[ext]'
      }]
    },
      {
        test: /\.pug$/,
        use: ['pug-loader']
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: [{
          loader: 'file-loader?name=/src/fonts/[name].[ext]'
        }]
      },
      {
        test: /\.(s(a|c)|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [{
          loader: 'file-loader?name=/src/images/[name].[ext]'
        }]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.pug',
    }),
    new MiniCssExtractPlugin({
      filename: "index.css"
    })
  ]
}