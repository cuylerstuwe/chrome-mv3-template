import {generatePrivateKeySync} from "./generatePrivateKeySync";
import {generatePublicKeySync} from "./generatePublicKeySync";

export function generateKeypairSync() {
    generatePrivateKeySync();
    generatePublicKeySync();
}