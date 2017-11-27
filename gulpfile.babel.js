'use strict';

import webpack from 'webpack'
import gulp from 'gulp'
import gutil from 'gulp-util'

import WebpackDevServer from 'webpack-dev-server'
import webpackDevConfig from './webpack.development.js'
import webpackProdConfig from './webpack.production.js'

/* client:dev */
gulp.task('client:dev', () => {
  let compiler = webpack(webpackDevConfig)
  let server = new WebpackDevServer(compiler, webpackDevConfig.devServer)
  let port = webpackDevConfig.devServer.port
  let host = webpackDevConfig.devServer.host

  let fn = err => {
    if(err) throw new gutil.PluginError("webpack-dev-server", err)
    gutil.log("[webpack-dev-server]", "http://" + host + ":" + port)
  }

  server.listen(port, host, fn)
})

gulp.task('client:build', (done) => {
  webpack(webpackProdConfig).run(x => done())
  gulp.src(__dirname + '/src/assets/favicon/*')
    .pipe(gulp.dest(__dirname + '/dist/favicon'))

  gulp.src(__dirname + '/src/assets/images/*')
    .pipe(gulp.dest(__dirname + '/dist/images'))

  gulp.src(__dirname + '/src/assets/manifest.json')
    .pipe(gulp.dest(__dirname + '/dist/manifest.json'))
})