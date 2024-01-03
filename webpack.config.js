// Generated using webpack-cli https://github.com/webpack/webpack-cli
const Dotenv = require('dotenv-webpack');
var webpack = require('webpack');
const path = require('path');
const isProduction = process.env.NODE_ENV == 'production';

let envPath = isProduction?"./.env.production":"./.env.development";
const config = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        // fix "process is not defined" error:
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
        new Dotenv(),
    ],
    resolve: {
        extensions: [ '.ts', '.js' ],
        fallback: {
            fs: false,
            'stream': require.resolve('stream-browserify'),
            'buffer': require.resolve('buffer'),
            'util': require.resolve('util'),
            'assert': require.resolve('assert'),
            'http': require.resolve('stream-http'),
            'url': require.resolve('url'),
            'https': require.resolve('https-browserify'),
            'os': require.resolve('os-browserify'),
            "path": require.resolve("path-browserify"),
            "crypto": require.resolve('crypto-browserify'),
            "zlib": false,
            "tls": false,
            "net": false,
            "querystring": require.resolve("querystring-es3"),
            "vm":require.resolve('vm-browserify'),
            "crypto-browserify": require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify

        }
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        
        
    } else {
        config.mode = 'development';
    }
    return config;
};