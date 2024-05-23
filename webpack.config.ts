import webpack from "webpack";
import path from "path";
import CopyPlugin from "copy-webpack-plugin";
import fs from "fs";
import childProcess from "child_process";
import HtmlWebpackPlugin from "html-webpack-plugin";
import {generateKeypairSync} from "./util/generateKeypairSync";
import {checkDoPublicAndPrivateKeysExist} from "./util/checkDoPublicAndPrivateKeysExist";

if(!checkDoPublicAndPrivateKeysExist()) {
    generateKeypairSync();
}

if(process.env.DEPLOY_MODE === 'initial-deploy') {
    const privateKeyStr = childProcess.execSync("sops --decrypt private-key.pem.enc", {
        cwd: path.resolve(__dirname)
    }).toString();

    fs.mkdirSync(path.resolve(__dirname, "dist"), {recursive: true});
    fs.writeFileSync(path.resolve(__dirname, "dist/key.pem"), privateKeyStr);
}

require('./src/meta/generate-manifest');

module.exports = {
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    devtool: "inline-source-map",
    entry: {
        serviceWorker: "./src/entry/background/serviceWorker/serviceWorker.ts",
        popup: "./src/entry/foreground/popup/popup.ts",
        content: "./src/entry/foreground/content/content.ts"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    "babel-loader",
                ],
                enforce: "pre"
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin(Object.fromEntries(Object.entries({
            "process.env.BUILD_ENV": JSON.stringify(process.env.BUILD_ENV),
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
            "process.env.DEPLOY_MODE": JSON.stringify(process.env.DEPLOY_MODE)
        }).filter(([k,v]) => v !== undefined))),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/meta/icons/'),
                    to: path.resolve(__dirname, 'dist/icons/')
                }
            ]
        }),
        new HtmlWebpackPlugin({
            template: "src/entry/foreground/popup/popup.html",
            filename: "popup.html",
            chunks: ["popup"]
        })
    ]
};