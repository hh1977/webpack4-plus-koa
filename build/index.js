const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackDevConfig = require('./webpack.dev.config.js');
const webpackProdConfig = require('./webpack.prod.config.js');
const ora = require('ora')
const path = require('path')
const chalk = require('chalk')
const opn = require('opn')
const util = require('./util')
const config = require('../config')

util.runCmd('sh', [path.join(config.scriptsDir,'clean.sh')], function(res){
  console.log(chalk.green(res + ' \n'))
});
util.runCmd('sh', [path.join(config.scriptsDir,'pullClover.sh')], function(res){
  console.log(chalk.green(res + ' \n'))
});

if (process.env.APP_ENV == 'dev') {
  const compiler = webpack(webpackDevConfig)
  const server = new WebpackDevServer(compiler, webpackDevConfig.devServer);
  server.listen(webpackDevConfig.devServer.port, 'localhost', function (err, result) {
    if (err) throw err;
    console.log(`Listening at http://localhost:${config.webpackPort}`);
  })
  compiler.plugin('emit', function (compilation, callback) {
    console.log(chalk.cyan('  Compilation complete.\n'))
    callback();
  })
} else {
  const spinner = ora('编译中...')
  spinner.start()
  webpack(webpackProdConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err;
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')
    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
}