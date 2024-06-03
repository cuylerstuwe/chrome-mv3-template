import path from "path";

module.exports = {
	output: {
		path: path.resolve(__dirname, '../../temp'),
		filename: "[name].js",
	},
	mode: process.env.NODE_ENV === "production" ? "production" : "development",
	devtool: process.env.NODE_ENV !== "production" ? "inline-source-map" : undefined,
	entry: {
		renderListenersRemappingPrinter: "./webpack-helpers/remappingScripts/buildRenderListenersRemappingPrinter.ts",
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".jsx"],
		modules: ["node_modules", path.resolve(__dirname, "../../src")],
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx|ts|tsx)$/,
				exclude: /node_modules/,
				use: ["babel-loader"],
				enforce: "pre",
			},
		],
	},
	plugins: [
	],
};
