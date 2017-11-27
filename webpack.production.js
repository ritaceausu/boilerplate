import webpack from 'webpack'
import { Config } from 'webpack-config'
import HtmlWebpackPlugin from 'html-webpack-plugin'

module.exports = new Config()
  .extend({
    './webpack.development.js': function(config) {
      delete config.debug
      delete config.devtool
      delete config.output.pathinfo
      delete config.devServer
      delete config.entry.server
      return config;
    }
  })
  .merge({
    plugins: [
      new HtmlWebpackPlugin({
        inject: false,
        template: __dirname + '/src/assets/index.ejs',
        mobile: true,
        appMountId: 'app',
        hash: true
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurrenceOrderPlugin(true),
      new webpack.optimize.UglifyJsPlugin({
        mangle: true,
        output: {
          comments: false
        },
        compress: {
          warnings: false
        }
      })
    ]
  })
