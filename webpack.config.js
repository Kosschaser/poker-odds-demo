const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
    mode: "development",
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
                    "style-loader", 
                    "css-loader", 
                    "sass-loader" 
                  ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'url-loader',
                ]
            }
        ]
    }
}