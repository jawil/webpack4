const path = require('path');
const webpack = require('webpack'); // eslint-disable-line
const CleanWebpackPlugin = require('clean-webpack-plugin'); // eslint-disable-line
const WebpackVersionPlugin = require('webpack-version-plugin'); // eslint-disable-line

module.exports = {
  entry: {
    react: ['react', 'react-dom'] // react模块打包到一个动态连接库
  },
  output: {
    path: path.resolve(__dirname, 'build/vendor/'),
    filename: '[name].dll.js', // 输出动态连接库的文件名称
    library: '_dll_[name]_[hash]' // 全局变量名称
  },
  devtool: '#source-map',
  plugins: [
    new webpack.DllPlugin({
      context: __dirname,
      name: '_dll_[name]_[hash]', // 和output.library中一致，也就是输出的manifest.json中的 name值
      path: path.join(__dirname, 'build/vendor', '[name].manifest.json')
    }),
    new CleanWebpackPlugin(['build/vendor'], { root: path.resolve() }),
    new WebpackVersionPlugin({
      cb: (hashMap) => {
        console.log(hashMap);
      }
    })
  ]
};
