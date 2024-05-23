import childProcess from "child_process";
import path from "path";

export function generatePublicKeySync() {
    childProcess.execSync("openssl rsa -in private-key.pem -pubout -outform DER | openssl base64 -A -out public-key-base64.txt", {
        cwd: path.resolve(__dirname, "../")
    });

    childProcess.execSync("sops --encrypt public-key-base64.txt > public-key-base64.txt.enc", {
        cwd: path.resolve(__dirname, "../")
    });
}