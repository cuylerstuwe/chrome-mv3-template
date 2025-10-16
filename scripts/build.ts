import fs from "fs";
import path from "path";
import { createRequire } from "module";
import ts from "typescript";
import { computeNameForWebpackOutputFolder } from "../webpack-helpers/computeNameForWebpackOutputFolder";
import { checkDoPublicAndPrivateKeysExist } from "../webpack-helpers/checkDoPublicAndPrivateKeysExist";
import { generateKeypairSync } from "../webpack-helpers/generateKeypairSync";
import { injectPrivateKeyIntoWebpackOutputFolder } from "../webpack-helpers/injectPrivateKeyIntoWebpackOutputFolder";
import { withEntriesWithFalsyValuesStripped } from "../webpack-helpers/withEntriesWithFalsyValuesStripped";
import { renderDispatcherRemappingModule } from "../webpack-helpers/remappingScripts/buildRenderListenersRemappingPrinter";

const rootDir = path.resolve(__dirname, "..");

function resolveFromRoot(...segments: string[]) {
        return path.resolve(rootDir, ...segments);
}

const tempDir = resolveFromRoot("temp");
const remappedDispatcherPath = path.resolve(tempDir, "remappedAllEnabledListeners.ts");

function applyCliEnvOverrides() {
        const args = process.argv.slice(2);
        for (let i = 0; i < args.length; i += 1) {
                const arg = args[i];
                if (arg === "--env" && args[i + 1]) {
                        process.env.NODE_ENV = args[i + 1];
                        i += 1;
                } else if (arg === "--build-env" && args[i + 1]) {
                        process.env.BUILD_ENV = args[i + 1];
                        i += 1;
                } else if (arg === "--deploy-mode" && args[i + 1]) {
                        process.env.DEPLOY_MODE = args[i + 1];
                        i += 1;
                }
        }
}

applyCliEnvOverrides();

function ensureDirectoryExists(dir: string) {
        fs.mkdirSync(dir, { recursive: true });
}

function writeRemappedDispatcherModule() {
        ensureDirectoryExists(tempDir);
        const moduleContents = `${renderDispatcherRemappingModule()}\n`;
        fs.writeFileSync(remappedDispatcherPath, moduleContents);
}

function copyRecursiveSync(src: string, dest: string) {
        const stats = fs.statSync(src);
        if (stats.isDirectory()) {
                ensureDirectoryExists(dest);
                for (const entry of fs.readdirSync(src)) {
                        copyRecursiveSync(path.join(src, entry), path.join(dest, entry));
                }
                return;
        }

        ensureDirectoryExists(path.dirname(dest));
        fs.copyFileSync(src, dest);
}

function writePopupHtml(outdir: string) {
        const popupTemplatePath = resolveFromRoot("src/foreground/popup/popup.html");
        const popupDestPath = path.join(outdir, "popup.html");
        const templateContents = fs.readFileSync(popupTemplatePath, "utf8");
        const scriptTag = '<script type="module" src="./popup.js"></script>';

        let output = templateContents;
        if (!templateContents.includes("popup.js")) {
                const closingBodyIndex = templateContents.lastIndexOf("</body>");
                if (closingBodyIndex === -1) {
                        output = `${templateContents}\n${scriptTag}`;
                } else {
                        output = `${templateContents.slice(0, closingBodyIndex)}    ${scriptTag}\n${templateContents.slice(closingBodyIndex)}`;
                }
        }

        ensureDirectoryExists(path.dirname(popupDestPath));
        fs.writeFileSync(popupDestPath, output);
}

function escapeRegExp(str: string) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function applyEnvDefines(code: string, envDefines: Record<string, string>) {
        let transformed = code;
        for (const [key, value] of Object.entries(envDefines)) {
                const pattern = new RegExp(escapeRegExp(key), "g");
                transformed = transformed.replace(pattern, value);
        }
        return transformed;
}

interface ModuleInfo {
        id: number;
        filePath: string;
        code: string;
        dependencies: Record<string, number>;
}

function createModuleBundler(envDefines: Record<string, string>) {
        const requireResolver = createRequire(import.meta.url);
        const compilerOptions: ts.CompilerOptions = {
                target: ts.ScriptTarget.ES2020,
                module: ts.ModuleKind.CommonJS,
                moduleResolution: ts.ModuleResolutionKind.NodeNext,
                baseUrl: resolveFromRoot("src"),
                esModuleInterop: true,
                allowSyntheticDefaultImports: true,
                resolveJsonModule: true,
                inlineSourceMap: process.env.NODE_ENV !== "production",
                inlineSources: process.env.NODE_ENV !== "production",
                allowJs: true,
        };

        const compilerHost = ts.createCompilerHost(compilerOptions, true);
        const modules = new Map<string, ModuleInfo>();

        function resolveModule(specifier: string, importerPath: string): string | null {
                if (specifier === "foreground/utils/dispatcher") {
                        return remappedDispatcherPath;
                }

                const resolution = ts.resolveModuleName(
                        specifier,
                        importerPath,
                        compilerOptions,
                        compilerHost,
                ).resolvedModule;

                if (resolution?.resolvedFileName) {
                        if (resolution.extension === ts.Extension.Dts) {
                                const withoutDts = resolution.resolvedFileName.replace(/\.d\.ts$/, "");
                                const candidateExtensions = [".js", ".cjs", ".mjs"];
                                for (const ext of candidateExtensions) {
                                        const candidate = `${withoutDts}${ext}`;
                                        if (fs.existsSync(candidate)) {
                                                return candidate;
                                        }
                                }
                                return null;
                        }
                        return resolution.resolvedFileName;
                }

                const potentialProjectPaths = [
                        path.resolve(path.dirname(importerPath), specifier),
                        path.resolve(resolveFromRoot("src"), specifier),
                        path.resolve(tempDir, specifier),
                ];

                for (const basePath of potentialProjectPaths) {
                        const resolved = resolveWithExtensions(basePath);
                        if (resolved) {
                                return resolved;
                        }
                }

                try {
                        return requireResolver.resolve(specifier, {
                                paths: [path.dirname(importerPath), rootDir],
                        });
                } catch (err) {
                        return null;
                }
        }

        function resolveWithExtensions(basePath: string): string | null {
                const candidates = [basePath];
                const extensionOrder = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json"];

                for (const ext of extensionOrder) {
                        candidates.push(`${basePath}${ext}`);
                }

                for (const candidate of candidates) {
                        if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
                                return candidate;
                        }
                }

                if (fs.existsSync(basePath) && fs.statSync(basePath).isDirectory()) {
                        for (const ext of extensionOrder) {
                                const indexCandidate = path.join(basePath, `index${ext}`);
                                if (fs.existsSync(indexCandidate) && fs.statSync(indexCandidate).isFile()) {
                                        return indexCandidate;
                                }
                        }
                }

                return null;
        }

        function processModule(filePath: string): ModuleInfo {
                const normalizedPath = path.normalize(filePath);
                const existing = modules.get(normalizedPath);
                if (existing) {
                        return existing;
                }

                const sourceText = fs.readFileSync(normalizedPath, "utf8");
                const transpiled = ts.transpileModule(sourceText, {
                        compilerOptions,
                        fileName: normalizedPath,
                        reportDiagnostics: true,
                });

                if (transpiled.diagnostics && transpiled.diagnostics.length > 0) {
                        const formattedDiagnostics = ts.formatDiagnosticsWithColorAndContext(
                                transpiled.diagnostics,
                                compilerHost,
                        );
                        throw new Error(`TypeScript compilation error in ${normalizedPath}:\n${formattedDiagnostics}`);
                }

                const codeWithEnv = applyEnvDefines(transpiled.outputText, envDefines);
                const moduleInfo: ModuleInfo = {
                        id: modules.size,
                        filePath: normalizedPath,
                        code: codeWithEnv,
                        dependencies: {},
                };
                modules.set(normalizedPath, moduleInfo);

                const requireRegex = /require\((['"])(.+?)\1\)/g;
                let match: RegExpExecArray | null;
                while ((match = requireRegex.exec(codeWithEnv))) {
                        const specifier = match[2];
                        const resolvedPath = resolveModule(specifier, normalizedPath);
                        if (!resolvedPath) {
                                continue;
                        }

                        const dependencyInfo = processModule(resolvedPath);
                        moduleInfo.dependencies[specifier] = dependencyInfo.id;
                }

                return moduleInfo;
        }

        function bundle(entryPath: string) {
                modules.clear();
                const entryInfo = processModule(entryPath);
                const orderedModules = Array.from(modules.values()).sort((a, b) => a.id - b.id);
                const modulesObjectLiteral = orderedModules
                        .map((module) => {
                                return `${module.id}: [function(require, module, exports) {\n${module.code}\n}, ${JSON.stringify(module.dependencies)}]`;
                        })
                        .join(",\n");

                return `(()=>{\nconst modules={\n${modulesObjectLiteral}\n};\nconst cache={};\nfunction require(id){\n        if(cache[id]){\n                return cache[id].exports;\n        }\n        const [fn,mapping]=modules[id];\n        const module={ exports:{} };\n        cache[id]=module;\n        function localRequire(name){\n                const targetId=mapping[name];\n                if(targetId===undefined){\n                        throw new Error(\`Module not found: \${name}\`);\n                }\n                return require(targetId);\n        }\n        fn(localRequire,module,module.exports);\n        return module.exports;\n}\nrequire(${entryInfo.id});\n})();\n`;
        }

        return { bundle };
}

async function runBundler(outdir: string) {
        const envDefines = withEntriesWithFalsyValuesStripped({
                "process.env.BUILD_ENV": JSON.stringify(process.env.BUILD_ENV),
                "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
                "process.env.DEPLOY_MODE": JSON.stringify(process.env.DEPLOY_MODE),
        }) as Record<string, string>;

        const bundler = createModuleBundler(envDefines);
        const entryPoints: Record<string, string> = {
                serviceWorker: resolveFromRoot("src/background/serviceWorker/serviceWorker.ts"),
                popup: resolveFromRoot("src/foreground/popup/popup.ts"),
                content: resolveFromRoot("src/foreground/content/content.ts"),
        };

        for (const [name, entryPath] of Object.entries(entryPoints)) {
                const bundleOutput = bundler.bundle(entryPath);
                fs.writeFileSync(path.join(outdir, `${name}.js`), bundleOutput);
        }
}

async function buildExtension() {
        const buildFolderName = computeNameForWebpackOutputFolder();
        const outdir = resolveFromRoot(buildFolderName);

        fs.rmSync(outdir, { recursive: true, force: true });
        fs.rmSync(tempDir, { recursive: true, force: true });

        if (!checkDoPublicAndPrivateKeysExist()) {
                generateKeypairSync();
        }

        if (process.env.DEPLOY_MODE === "initial-deploy") {
                injectPrivateKeyIntoWebpackOutputFolder();
        }

        writeRemappedDispatcherModule();

        await import("../static/generate-manifest");

        ensureDirectoryExists(outdir);

        copyRecursiveSync(resolveFromRoot("static/icons"), path.join(outdir, "icons"));
        writePopupHtml(outdir);

        try {
                await runBundler(outdir);
        } finally {
                fs.rmSync(tempDir, { recursive: true, force: true });
        }
}

buildExtension().catch((error) => {
        console.error(error);
        process.exitCode = 1;
});
