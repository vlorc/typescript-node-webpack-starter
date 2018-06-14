'use strict'

const path = require('path');
const webpack = require('webpack');

const BabiliWebpackPlugin = require('babili-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

let externals = _externals();

let config = {
    entry: {
        main: path.join(__dirname, './src/main.ts'),
    },
    externals: externals,
    module: {
        rules: [{
                enforce: 'pre',
                test: /\.js$/,
                loader: "source-map-loader",
            }, {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.node$/,
                use: 'node-loader',
            }
        ]
    },
    node: {
        console: true,
        global: true,
        process: true,
        Buffer: true,
        __filename: true,
        __dirname: true,
        setImmediate: true,
    },
    output: {
        filename: '[name].js',
        libraryTarget: 'commonjs2',
        path: path.join(__dirname, 'dist'),
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
    ],
    resolve: {
        extensions: ['.ts', '.js', '.json', '.node']
    },
    target: 'node',
}

/**
 * Adjust config for development settings
 */
if (process.env.NODE_ENV !== 'production') {
    config.plugins.push(
        new webpack.BannerPlugin({
            raw: true,
            entryOnly: false,
            banner: 'require("source-map-support").install();',
        })
    )
    config.devtool = 'source-map';
} else {
    config.plugins.push(
        new CleanWebpackPlugin(['./dist']),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"',
        }),
        new BabiliWebpackPlugin(),
    );
}

function _externals() {
    let manifest = require('./package.json');
    let dependencies = manifest.dependencies;
    let externals = {};
    for (let p in dependencies) {
        externals[p] = 'commonjs ' + p;
    }
    return externals;
}

module.exports = config