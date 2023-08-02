/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-03 09:46:19
 * @LastEditTime: 2022-06-27 14:51:54
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 */
'use strict';
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path');
const appPackage = require('../package.json');
const iotPlatform = appPackage.iotPlatform;
module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: [
      {
        context: ['/appfront'], // 路径前缀
        target: 'https://app-service-chn-31a93883.ibroadlink.com', // app中国集群环境
        changeOrigin: true,
        logLevel: 'debug',
      },
      {
        context: ['/farm'], // 路径前缀
        target: 'https://app-service-chn-31a93883.ibroadlink.com', // app中国集群环境
        changeOrigin: true,
        logLevel: 'debug',
      },
    ],

    // Various Dev Server settings
    host: '0.0.0.0', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true,
  },

  build: {
    vueModule: 'vue/dist/vue.esm.js',
    // Template for index.html
    index: path.resolve(
      __dirname,
      iotPlatform === 'dna' ? '../dist/zh-cn/app.html' : '../dist/index.html'
    ),
    scene: path.resolve(__dirname, '../dist/zh-cn/custom.html'),
    // Paths
    assetsRoot: path.resolve(
      __dirname,
      iotPlatform === 'dna' ? '../dist/zh-cn' : '../dist'
    ),
    assetsSubDirectory: '',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,
  },
};
