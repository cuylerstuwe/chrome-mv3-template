import webpack from "webpack";
import path from "path";
import CopyPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { generateKeypairSync } from "./util/generateKeypairSync";
import { checkDoPublicAndPrivateKeysExist } from "./util/checkDoPublicAndPrivateKeysExist";
import { injectPrivateKeyIntoWebpackOutputFolder } from "./util/injectPrivateKeyIntoWebpackOutputFolder";
import { withEntriesWithFalsyValuesStripped } from "./util/withEntriesWithFalsyValuesStripped";
import { computeNameForWebpackOutputFolder } from "./util/computeNameForWebpackOutputFolder";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

const nameForWebpackOutputFolder = computeNameForWebpackOutputFolder();

if (!checkDoPublicAndPrivateKeysExist()) {
	generateKeypairSync();
}

if (process.env.DEPLOY_MODE === "initial-deploy") {
	injectPrivateKeyIntoWebpackOutputFolder();
}

require("./src/metadata/generate-manifest");

module.exports = {
	output: {
		path: path.resolve(__dirname, nameForWebpackOutputFolder),
		filename: "[name].js",
	},
	mode: process.env.NODE_ENV === "production" ? "production" : "development",
	devtool: process.env.NODE_ENV !== "production" ? "inline-source-map" : undefined,
	entry: {
		serviceWorker: "./src/background/serviceWorker/serviceWorker.ts",
		popup: "./src/foreground/popup/popup.ts",
		content: "./src/foreground/content/content.ts",
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".jsx"],
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
		new ForkTsCheckerWebpackPlugin({
			typescript: {
				diagnosticOptions: {
					semantic: true,
					syntactic: true,
				},
				mode: "write-references",
			},
		}),
		new webpack.DefinePlugin(
			withEntriesWithFalsyValuesStripped({
				"process.env.BUILD_ENV": JSON.stringify(process.env.BUILD_ENV),
				"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
				"process.env.DEPLOY_MODE": JSON.stringify(process.env.DEPLOY_MODE),
			}),
		),
		new CopyPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, "src/metadata/icons/"),
					to: path.resolve(__dirname, `${nameForWebpackOutputFolder}/icons/`),
				},
			],
		}),
		new HtmlWebpackPlugin({
			template: "src/foreground/popup/popup.html",
			filename: "popup.html",
			chunks: ["popup"],
		}),
	],
};
