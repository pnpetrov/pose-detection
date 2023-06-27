import path from 'path';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const PUBLIC_DIR = path.resolve('public');
const OUTPUT_DIR = path.resolve('build');

export default {
	entry: "index.js",
	mode: process.env.NODE_ENV,
	...(process.env.NODE_ENV === 'development' && {
		devServer: {
			port: 3000,
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
		new HtmlWebpackPlugin(),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: PUBLIC_DIR,
					to: path.basename(PUBLIC_DIR)
				}
			]
		})
	]
};