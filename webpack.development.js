import path from 'path'
import text from 'extract-text-webpack-plugin'
import webpack from 'webpack'
import { Config } from 'webpack-config'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const exclude = /node_modules/

process.env.NODE_ENV = 'development'
console.log('NODE_ENV', process.env.NODE_ENV)

const envVars = {
  'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`
}

const HOST_IP = 'localhost'
const HOST_PORT = '8080'
const APP_TITLE = 'Flying Garden'

module.exports = new Config().merge({
  node: {
    fs: 'empty'
  },
  devtool: 'source-map',
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
    pathinfo: true,
    publicPath: '/'
  },
  resolve: {
    alias: {
      'assets': 'src/assets',
      'css': 'src/assets/css',
      'fonts': 'src/assets/fonts',
      'js': 'src/assets/js',
      'images': 'src/assets/images',
    },
    modules: [
      __dirname + '/src',
      'node_modules'
    ],
    extensions: ['.webpack.js', '.web.js', '.ts', '.js', '.css', '.tag', '.yml', '.yaml'],
  },
  entry: {
    server: [
      `webpack-dev-server/client?http://${HOST_IP}:${HOST_PORT}`,
      'webpack/hot/dev-server'
    ],
    app: [
       __dirname + '/src/app'
    ],
    // vendor: []
  },
  plugins: [
    new text('[name].css'),
    new webpack.DefinePlugin(envVars),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' }),
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: 'src/assets/index.ejs',
      mobile: false,
      baseHref: HOST_IP,
      appMountId: 'app',
      devServer: process.env.NODE_ENV === 'development' ? `http://${HOST_IP}:${HOST_PORT}` : undefined,
      title: APP_TITLE,
      hash: true
    })
  ],
  devServer: {
    historyApiFallback: true,
    contentBase: __dirname + '/src/assets',
    hot: true,
    inline: true,
    stats: 'errors-only',
    port: HOST_PORT,
    host: HOST_IP
  },
  module: {
    rules: [
      { enforce: 'pre', test: /\.yml|\.yaml$/, exclude: exclude, loaders: ['json-loader', 'yaml-loader']  },
      { enforce: 'pre', test: /\.json$/, exclude: exclude, loader: 'json-loader' },
      { enforce: 'pre', test: /\.png$/, exclude: exclude, loader: 'url-loader?limit=5000' },
  /*    { enforce: 'pre', test: /\.css$/, exclude: exclude,
          use: [
            'style-loader',
             {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  alias: {
                    './fonts': '../fonts'
                  }
                }
             },
             {
                loader: 'postcss-loader',
                options: {
                  plugins: (loader) => ([
                    require('tailwindcss')(__dirname + '/tailwind.js'),
                    require('autoprefixer')
                  ])
                }
             }
          ]
      }, */
      { enforce: 'pre', test: /\.jpg$/, exclude: exclude, loader: 'url-loader?prefix=img/&limit=5000' },
      { enforce: 'pre', test: /\.gif$/, exclude: exclude, loader: 'url-loader?prefix=img/&limit=5000' },
      { enforce: 'pre', test: /\.woff/, exclude: exclude, loader: 'url-loader?prefix=font/&limit=5000' },
      { enforce: 'pre', test: /\.woff2/, exclude: exclude, loader: 'url-loader?prefix=font/&limit=5000' },
      { enforce: 'pre', test: /\.eot/, exclude: exclude, loader: 'file-loader?prefix=font/' },
      { enforce: 'pre', test: /\.ttf/, exclude: exclude, loader: 'file-loader?prefix=font/' },
      { enforce: 'pre', test: /\.svg/, exclude: exclude, loader: 'file-loader?prefix=font/' },
      { enforce: 'pre', test: /\.pug$/, exclude: exclude, loader: 'jsonmvc-pug-view-loader' },
      { enforce: 'pre', test: /\.html$/, exclude: exclude, loader: 'html-loader', query: { minimize: true } },
      { test: /\.js$/, exclude: exclude, loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
})
