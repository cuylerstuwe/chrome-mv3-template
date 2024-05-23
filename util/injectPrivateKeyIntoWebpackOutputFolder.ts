import childProcess from "child_process";
import path from "path";
import fs from "fs";
import {computeNameForWebpackOutputFolder} from "./computeNameForWebpackOutputFolder";

const nameForWebpackOutputFolder = computeNameForWebpackOutputFolder();

export function injectPrivateKeyIntoWebpackOutputFolder() {
    const privateKeyStr = childProcess.execSync("sops --decrypt private-key.pem.enc", {
        cwd: path.resolve(__dirname, "../")
    }).toString();

    fs.mkdirSync(path.resolve(__dirname, `../${nameForWebpackOutputFolder}`), {recursive: true});
    fs.writeFileSync(path.resolve(__dirname, `../${nameForWebpackOutputFolder}/key.pem`), privateKeyStr);
}