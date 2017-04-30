const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const development = require('./dev.config');
const production = require('./prod.config');

const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
    app: path.join(__dirname, '../../front-end'),
    build: path.join(__dirname, '../../build'),
};

const VENDOR = [
    'babel-polyfill',
    'vue',
    'socket.io-client',
    'redux',
    'revue'
];

process.env.BABEL_ENV = TARGET;

const common = {
    entry: {
        app: PATHS.app,
        vendor: VENDOR,
    },

    output: {
        filename: '[name].js',
        path: PATHS.build
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../index.html'),
            hash: true,
            filename: 'index.html',
            inject: 'body'
        }),

        new webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: 'vendor.js'}),
        new CleanWebpackPlugin([PATHS.build], {
            root: process.cwd()
        }),
        new CopyWebpackPlugin([
            {
                from: 'front-end/media',
                to: 'media'
            },
        ])
    ],

    resolve: {
        extensions: ['', '.jsx', '.js', '.json', '.scss'],
        modulesDirectories: ['node_modules', PATHS.app],
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel-loader?presets[]=es2015'],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                loader: 'style!css!'
            }
        ]
    }
};

if (TARGET === 'dev' || !TARGET) {
    module.exports = merge(development, common);
}

if (TARGET === 'prod' || !TARGET) {
    module.exports = merge(production, common);
}
