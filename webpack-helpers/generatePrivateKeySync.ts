import childProcess from "child_process";
import fs from "fs";
import path from "path";

export function generatePrivateKeySync() {
	childProcess.execSync("openssl genrsa 2048 | openssl pkcs8 -topk8 -nocrypt -out private-key.pem", {
		cwd: path.resolve(__dirname, "../"),
	});

	// Encrypt the private key with SOPS
	childProcess.execSync("sops --encrypt private-key.pem > private-key.pem.enc", {
		cwd: path.resolve(__dirname, "../"),
	});
}
