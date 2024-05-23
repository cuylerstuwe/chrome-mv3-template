import childProcess from "child_process";
import path from "path";
import fs from "fs";

export function injectPrivateKeyIntoDistFolder() {
    const privateKeyStr = childProcess.execSync("sops --decrypt private-key.pem.enc", {
        cwd: path.resolve(__dirname, "../")
    }).toString();

    fs.mkdirSync(path.resolve(__dirname, "../dist"), {recursive: true});
    fs.writeFileSync(path.resolve(__dirname, "../dist/key.pem"), privateKeyStr);
}