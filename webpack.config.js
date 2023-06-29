import path from 'path';

import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

import packageJSON from './package.json' assert { type: "json" };

// TODO: `docs` is used so the final build can be deployed to GitHub Pages
const OUTPUT_DIR = path.resolve('docs');
const MODELS_DIR = path.resolve('models');

const PORT = 3000;

export default {
	entry: "index.js",
	mode: process.env.NODE_ENV,
	...(process.env.NODE_ENV === 'development' && {
		devServer: {
			port: PORT,
			https: true,
			hot: true
		},
	}),
	devtool: 'cheap-module-source-map',
	resolve: {
		extensions: ['.js'],
		modules: [path.resolve('src'), 'node_modules']
	},
	output: {
		clean: true,
		path: OUTPUT_DIR
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: packageJSON.description || packageJSON.name
		}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: MODELS_DIR,
					to: path.basename(MODELS_DIR)
				}
			]
		}),
		new webpack.EnvironmentPlugin({
			MOVE_NET_MODEL: {
				'production': `/${packageJSON.name}/models/move-net/model.json`,
				'development': '/models/move-net/model.json'
			}[process.env.NODE_ENV]
		})
	]
};