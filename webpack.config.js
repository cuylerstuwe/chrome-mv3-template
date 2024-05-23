const webpack = require("webpack");
const path = require('path');
const childProcess = require('child_process');
const CopyPlugin = require("copy-webpack-plugin");
const fs = require('fs');

function checkDoPublicAndPrivateKeysExist() {
    const privateKeyExists = fs.existsSync(path.resolve(__dirname, "private-key.pem"));
    const publicKeyExists = fs.existsSync(path.resolve(__dirname, "public-key-base64.txt"));
    return privateKeyExists && publicKeyExists;
}

function generatePrivateKeySync() {
    childProcess.execSync("openssl genrsa 2048 | openssl pkcs8 -topk8 -nocrypt -out private-key.pem", {
        cwd: path.resolve(__dirname)
    });
}

function generatePublicKeySync() {
    childProcess.execSync("openssl rsa -in private-key.pem -pubout -outform DER | openssl base64 -A -out public-key-base64.txt", {
        cwd: path.resolve(__dirname)
    });
}

function generateKeypairSync() {
    generatePrivateKeySync();
    generatePublicKeySync();
}

if(!checkDoPublicAndPrivateKeysExist()) {
    generateKeypairSync();
}

if(process.env.DEPLOY_MODE === 'initial-deploy') {
    fs.mkdir(path.resolve(__dirname, "dist"), {recursive: true}, () => {});
    fs.cp(path.resolve(__dirname, "private-key.pem"), path.resolve(__dirname, "dist/key.pem"), () => {});
}

require('./src/meta/manifest.js');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: {
        serviceWorker: "./src/entry/background/serviceWorker/serviceWorker.js",
        popup: "./src/entry/foreground/popup/popup.js",
        content: "./src/entry/foreground/content/content.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    "babel-loader",
                ],
                enforce: "pre"
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            // "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
            "process.env": {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            },
            "process.env.BUILD_ENV": JSON.stringify(process.env.BUILD_ENV)
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/icons/'),
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