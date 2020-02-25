const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

const minify = {
    minifyCSS: true,
    minifyJS: true,
    removeComments: true, // 删除HTML中的注释
    collapseWhitespace: true, // 删除空白符与换行符
    collapseBooleanAttributes: true, // 省略布尔属性的值 <input checked="true"/> ==> <input checked />
    removeEmptyAttributes: true, // 删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true, // 删除script上的type
    removeStyleLinkTypeAttributes: true // 删除style上的type
}

module.exports = options => {
    const env = require('./env/' + options.config + '.js')
    const plugin = require('./env/pro.js').plugin
    const port = env.port || 9999
    const isLocal = options.local
    const libs = []
    const rules = [
        {
            test: /\.js$/,
            use: 'babel-loader'
        },
        {
            test: /\.scss$/,
            use: [
                isLocal ? 'style-loader' : MiniCssExtractPlugin.loader,
                'css-loader',
                'postcss-loader',
                'sass-loader'
            ]
        },
        {
            test: /\.(png|jpg|gif|svg|ico)$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        name: 'images/[name]-[hash:8].[ext]',
                        limit: 1000
                    }
                }
            ]
        }
    ]
    const plugins = [
        new HtmlWebpackPlugin({
            template: './demo/index.ejs',
            filename: 'index.html',
            minify,
            libs
        })
    ]
    if (isLocal) {
        plugins.push(new webpack.HotModuleReplacementPlugin())
    } else {
        plugins.push(
            new OptimizeCssAssetsPlugin(),
            new MiniCssExtractPlugin({
                filename: 'css/[name]-[hash:8].min.css'
            })
        )
    }

    // 如果是本地开发，使用未压缩的插件
    if (isLocal) {
        plugin.forEach((item, i) => {
            plugin[i] = item
                .replace('.min', '')
                .replace('.production', '.development')
        })
    }
    plugin.forEach(item => {
        libs.push({
            url: item,
            isAsync: false
        })
    })

    return {
        mode: isLocal ? 'development' : 'production',
        entry: {
            app: './demo'
        },
        output: {
            publicPath: isLocal
                ? ''
                : '//' + env.host.cdn + '/react-colorpicker/',
            filename: isLocal ? 'js/[name].js' : 'js/[name]-[hash:8].min.js',
            path: path.resolve('dist') // 打包后的目录，必须是绝对路径
        },
        module: {
            rules
        },
        plugins,
        devtool: options.pro ? false : 'source-map',
        devServer: {
            port,
            hot: true
        }
    }
}
