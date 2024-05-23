import fs from "fs";
import path from "path";

export function checkDoPublicAndPrivateKeysExist() {
    const privateKeyExists = fs.existsSync(path.resolve(__dirname, "../private-key.pem.enc"));
    const publicKeyExists = fs.existsSync(path.resolve(__dirname, "../public-key-base64.txt.enc"));
    return privateKeyExists && publicKeyExists;
}