import { generatePrivateKeySync } from "./generatePrivateKeySync";
import { generatePublicKeySync } from "./generatePublicKeySync";
import { removeNonEncryptedKeysSync } from "./removeNonEncryptedKeysSync";

export function generateKeypairSync() {
	generatePrivateKeySync();
	generatePublicKeySync();
	removeNonEncryptedKeysSync();
}
