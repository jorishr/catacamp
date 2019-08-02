const path = require('path');
module.exports = {
    mode: 'development',
    entry: {
        app: './app/public/scripts/main.js',
        vendor: './app/public/scripts/vendor.js'
    },
    output: {
        path: path.resolve(__dirname, './app/public'),
        filename: '[name]-bundle.js'
    },
    module: {
        rules: [{
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }]
    }
}