const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: "production",
    entry: './src/js/index.js',
    output: {
        filename: 'index.[contentHash].js',
        path: path.resolve(__dirname, "dist")
    },
    devServer: {
        contentBase: './dist',
        open: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[contentHash].css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                        }
                    }
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader", 
                    "sass-loader" 
                  ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'url-loader',
                ]
            },
            {
                test: /\.html$/i,
                use: {    
                    loader: 'html-loader',
                    options: {
                        minimize: true
                    }
                }
            }
        ]
    }
}