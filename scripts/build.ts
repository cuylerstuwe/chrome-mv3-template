import { build, Plugin } from "esbuild";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import childProcess from "child_process";
import { computeNameForWebpackOutputFolder } from "../webpack-helpers/computeNameForWebpackOutputFolder";
import { checkDoPublicAndPrivateKeysExist } from "../webpack-helpers/checkDoPublicAndPrivateKeysExist";
import { generateKeypairSync } from "../webpack-helpers/generateKeypairSync";
import { injectPrivateKeyIntoWebpackOutputFolder } from "../webpack-helpers/injectPrivateKeyIntoWebpackOutputFolder";
import { withEntriesWithFalsyValuesStripped } from "../webpack-helpers/withEntriesWithFalsyValuesStripped";
import { buildRemappedDispatcherSource } from "../webpack-helpers/remappingScripts/buildRemappedDispatcher";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, "../");
const tempDir = path.resolve(rootDir, "temp");

function runTypeCheck() {
        childProcess.execSync("tsc --noEmit", {
                stdio: "inherit",
                cwd: rootDir,
        });
}

function ensureKeys() {
        if (!checkDoPublicAndPrivateKeysExist()) {
                generateKeypairSync();
        }
}

function maybeInjectPrivateKey() {
        if (process.env.DEPLOY_MODE === "initial-deploy") {
                injectPrivateKeyIntoWebpackOutputFolder();
        }
}

async function ensureManifest() {
        await import(path.resolve(rootDir, "static/generate-manifest"));
}

function writeRemappedDispatcher() {
        fs.mkdirSync(tempDir, { recursive: true });
        fs.writeFileSync(
                path.resolve(tempDir, "remappedAllEnabledListeners.ts"),
                buildRemappedDispatcherSource(),
        );
}

function cleanTempDir() {
        fs.rmSync(tempDir, { recursive: true, force: true });
}

function copyStaticAssets(outputDir: string) {
        fs.mkdirSync(outputDir, { recursive: true });
        const iconsSource = path.resolve(rootDir, "static/icons");
        const iconsDestination = path.resolve(outputDir, "icons");
        fs.mkdirSync(iconsDestination, { recursive: true });
        fs.cpSync(iconsSource, iconsDestination, { recursive: true });

        const popupHtmlSource = path.resolve(rootDir, "src/foreground/popup/popup.html");
        const popupHtmlDestination = path.resolve(outputDir, "popup.html");
        fs.copyFileSync(popupHtmlSource, popupHtmlDestination);
}

function buildDefineObject() {
        const entries = withEntriesWithFalsyValuesStripped({
                "process.env.BUILD_ENV": process.env.BUILD_ENV && JSON.stringify(process.env.BUILD_ENV),
                "process.env.NODE_ENV": process.env.NODE_ENV && JSON.stringify(process.env.NODE_ENV),
                "process.env.DEPLOY_MODE": process.env.DEPLOY_MODE && JSON.stringify(process.env.DEPLOY_MODE),
        });

        return entries;
}

function dispatcherAliasPlugin(remappedPath: string): Plugin {
        return {
                name: "dispatcher-alias",
                setup(buildContext) {
                        buildContext.onResolve({ filter: /^foreground\/utils\/dispatcher$/ }, () => ({
                                path: remappedPath,
                        }));
                },
        };
}

async function runEsbuild(outputDir: string) {
        const remappedPath = path.resolve(tempDir, "remappedAllEnabledListeners.ts");

        await build({
                absWorkingDir: rootDir,
                bundle: true,
                entryNames: "[name]",
                entryPoints: {
                        serviceWorker: path.resolve(rootDir, "src/background/serviceWorker/serviceWorker.ts"),
                        popup: path.resolve(rootDir, "src/foreground/popup/popup.ts"),
                        content: path.resolve(rootDir, "src/foreground/content/content.ts"),
                },
                format: "iife",
                logLevel: "info",
                minify: process.env.NODE_ENV === "production",
                outdir: outputDir,
                platform: "browser",
                plugins: [dispatcherAliasPlugin(remappedPath)],
                sourcemap: process.env.NODE_ENV !== "production" ? "inline" : false,
                target: "chrome110",
                tsconfig: path.resolve(rootDir, "tsconfig.json"),
                define: buildDefineObject(),
        });
}

async function main() {
        const outputDirName = computeNameForWebpackOutputFolder();
        const outputDir = path.resolve(rootDir, outputDirName);

        ensureKeys();
        maybeInjectPrivateKey();
        await ensureManifest();
        writeRemappedDispatcher();
        runTypeCheck();
        copyStaticAssets(outputDir);

        try {
                await runEsbuild(outputDir);
        } finally {
                cleanTempDir();
        }
}

main().catch((error) => {
        console.error(error);
        process.exit(1);
});
