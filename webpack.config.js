const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const PostcssPxtorem = require('postcss-pxtorem');
const AutoPrefixer = require('autoprefixer'); // eslint-disable-line

const ROOT_PATH = path.resolve(__dirname);
const APP_PATH = path.resolve(ROOT_PATH, 'src');
const BUILD_PATH = path.resolve(ROOT_PATH, 'build');
const svgDirs = [
  path.resolve(__dirname, 'src/my-project-svg-foler') // 自己私人的 svg 存放目录
];

const env = process.env.NODE_ENV;

module.exports = {
  devtool: env === 'production' ? false : 'cheap-module-eval-source-map',
  entry: { app: ['./src/app.tsx', 'react-hot-loader/patch'] },
  mode: env === 'production' ? 'production' : 'development',
  output: {
    path: BUILD_PATH, // 编译到当前目录
    filename: '[name].js'
  },
  devServer: {
    contentBase: BUILD_PATH,
    historyApiFallback: true,
    hot: true,
    open: true,
    inline: true,
    port: 8888,
    compress: false // 开发服务器是否启动gzip等压缩
    /*  https: {
      key: fs.readFileSync('/path/to/server.key'),
      cert: fs.readFileSync('/path/to/server.crt'),
      ca: fs.readFileSync('/path/to/ca.pem')
    } */
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: loader => [
                  PostcssPxtorem({
                    rootValue: 100,
                    propWhiteList: ['*']
                  }),
                  AutoPrefixer({
                    browsers: [
                      'last 2 versions',
                      'Firefox ESR',
                      '> 1%',
                      'ie >= 8',
                      'iOS >= 8',
                      'Android >= 4'
                    ]
                  })
                ]
              }
            },
            'sass-loader'
          ]
        })
      },
      {
        test: /\.less$/,
        use: [
          { loader: 'style-loader', options: { sourceMap: true } },
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'less-loader', options: { sourceMap: true } }
        ]
      },
      {
        test: /\.css$/,
        include: [path.resolve('src')],
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        use: [
          {
            loader: 'eslint-loader',
            options: { fix: true }
          }
        ],
        include: [path.resolve(__dirname, 'src')], // 指定检查的目录
        exclude: /node_modules/
      },

      {
        test: /\.jsx?$/, // 用babel编译jsx和es6
        include: [path.resolve(__dirname, 'src')], // 指定检查的目录
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: ['react', 'stage-2', ['env', { modules: false }]],
          // modules关闭 Babel 的模块转换功能，保留原本的 ES6 模块化语法
          plugins: ['transform-runtime', 'transform-decorators-legacy', 'react-hot-loader/babel']
        }
      },
      {
        test: /\.tsx?$/, // 用babel编译jsx和es6
        include: [path.resolve(__dirname, 'src')], // 指定检查的目录
        exclude: /node_modules/,
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              useBabel: true,
              babelOptions: {
                babelrc: false /* Important line */,
                presets: ['react', 'stage-2', ['env', { modules: false }]], // 关闭 Babel 的模块转换功能，保留原本的 ES6 模块化语法
                plugins: ['transform-runtime', 'react-hot-loader/babel']
              }
            }
          }
        ]
        /*         use: [
          'cache-loader',
          'thread-loader',
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets:["react", "stage-2", ["env", { "modules": false }]],//关闭 Babel 的模块转换功能，保留原本的 ES6 模块化语法
              plugins: ['transform-runtime', 'react-hot-loader/babel']
            }
          },
          {
            loader: 'ts-loader',
            options: {
              happyPackMode: true,
              transpileOnly: true
            }
          }
        ] */
      },
      {
        test: /\.(woff|woff2|eot|ttf)(\?.*$|$)/,
        use: ['url-loader']
      },
      {
        test: /\.(svg)$/i,
        use: ['svg-sprite-loader'],
        include: svgDirs // 把 svgDirs 路径下的所有 svg 文件交给 svg-sprite-loader 插件处理
      },
      {
        test: /\.(png|jpg)$/,
        use: ['url-loader?limit=8192&name=images/[hash:8].[name].[ext]']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: './index.html', // 生成的html存放路径，相对于 path
      template: './src/index.html',
      inject: true, // 允许插件修改哪些内容，包括head与body
      hash: true // 为静态资源生成hash值
    }),
    new ExtractTextPlugin({
      // 指定css文件名 打包成一个css
      filename: 'index.css',
      disable: false,
      allChunks: true
    }),
    new webpack.DllReferencePlugin({
      context: '.',
      manifest: require('./build/react.manifest.json'), // eslint-disable-line
      extensions: ['.js', '.jsx']
    }),
    new ForkTsCheckerWebpackPlugin({
      checkSyntacticErrors: true,
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      tslint: path.resolve(__dirname, 'tslint.json'),
      watch: ['./src/**/*.tsx'],
      ignoreLints: ['no-console', 'object-literal-sort-keys', 'quotemark']
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]), // 忽略掉 d.ts 文件，避免因为编译生成 d.ts 文件导致又重新检查。
    new webpack.optimize.ModuleConcatenationPlugin()
    // 3.0新功能 范围提升 （Scope Hoisting ）,作用域提升，这是在webpack3中所提出来的。它会使代码体积更小，因为函数申明语句会产生大量代码.
  ],

  resolve: {
    modules: ['node_modules', path.join(__dirname, './node_modules')],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.less', '.scss', '.json'],
    alias: {
      components: path.resolve(APP_PATH, './components')
    }
  },

  externals: {
    zepto: 'Zepto'
  },
  watch: env === 'development',
  watchOptions: {
    ignored: /node_modules/, // 忽略不用监听变更的目录
    aggregateTimeout: 500, // 防止重复保存频繁重新编译,500毫米内重复保存不打包
    poll: 1000 // 每秒询问的文件变更的次数
  }
};

if (env === 'production') {
  module.exports.optimization = {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: true,
          ecma: 6,
          mangle: true
        },
        sourceMap: true
      })
    ]
    // 这个变化还是很大的，之前的webpack版本用的都是commonchunkplugin，但是webpack4开始使用common-chunk-and-vendor-chunk 配置如下:
    /* splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 5, // The default limit is too small to showcase the effect
          minSize: 0 // This is example is too small to create commons chunks
        },
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10,
          enforce: true
        }
      }
    } */
  };

  module.exports.plugins = (module.exports.plugins || []).concat([
    new OptimizeCssAssetsPlugin({})
    // new CleanPlugin([BUILD_PATH])
  ]);
}
