const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


const commonOptions = {
	entry: {
		'xonomy': './src/xonomy.ts',
	},
	module: {
		rules: [{
			test: /\.tsx?$/,
			exclude: /node_modules/,
			loader: 'ts-loader',
		}, {
			test: /\.s?css$/,
			use: [
				{
					loader: MiniCssExtractPlugin.loader,
					options: {
						publicPath: './'
					}
				}, 
				'css-loader',
				'sass-loader'
			],
		}]
	},
	output: {
		// Path on disk for output file
		path: path.resolve(__dirname, 'dist'),
		// Path in webpack-dev-server for compiled files (has priority over disk files in case both exist)
		publicPath: '/dist/',
	},
	resolve: {
		extensions: ['.js', '.ts'], // enable autocompleting .ts and .js extensions when using import '...'
		alias: {
			// Enable importing source files by their absolute path by prefixing with "@/"
			// Note: this also requires typescript to be able to find the imports (though it doesn't use them other than for type checking), see tsconfig.json
			"@": path.join(__dirname, "src"),
		}
	},
	plugins: [new MiniCssExtractPlugin()],
};

module.exports = [{
	...commonOptions, 
	output: {
		...commonOptions.output, 
		filename: '[name].umd.js',
		library: {
			// name: 'Xonomy',
			type: 'umd',
			umdNamedDefine: true,
			// export: 'default', // use the default export of the library...
		},
	}
}, {
	...commonOptions, 
	experiments: { outputModule: true },
	output: {
		...commonOptions.output, 
		filename: '[name].esm.js',
		library: {
			type: 'module'
		}
	}
}, 

]
