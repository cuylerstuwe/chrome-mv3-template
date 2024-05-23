import fs from "fs";
import path from "path";

export function removeNonEncryptedKeysSync() {
    fs.rmSync(path.resolve(__dirname, "../private-key.pem"));
    fs.rmSync(path.resolve(__dirname, "../public-key-base64.txt"));
}