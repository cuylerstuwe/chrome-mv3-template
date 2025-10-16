import path from "path";
import { fileURLToPath } from "url";
import { dispatcher } from "../../src/foreground/utils/dispatcher";

function getParams(func: (...args: any[]) => unknown) {
        return (func + "")
                .replace(/[/][/].*$/gm, "") // strip single-line comments
                .replace(/\s+/g, "") // strip white space
                .replace(/[/][*][^/*]*[*][/]/g, "") // strip multi-line comments
                .split("){", 1)[0]
                .replace(/^[^(]*[(]/, "") // extract the parameters
                .replace(/=[^,]+/g, "") // strip any ES6 defaults
                .split(",")
                .filter(Boolean); // split & filter [""]
}

function getParamsWithDefaults(func: (...args: any[]) => unknown) {
        return (func + "")
                .replace(/[/][/].*$/gm, "") // strip single-line comments
                .replace(/\s+/g, "") // strip white space
                .replace(/[/][*][^/*]*[*][/]/g, "") // strip multi-line comments
                .split("){", 1)[0]
                .replace(/^[^(]*[(]/, "") // extract the parameters
                .split(",")
                .filter(Boolean); // split & filter [""]
}

function mapFnToChromeRuntimeSendMessage(fn: (...args: any[]) => unknown) {
        const params = getParams(fn);
        const paramsWithDefaults = getParamsWithDefaults(fn)!;
        const paramsLabeledAsAnyType = paramsWithDefaults.map((param: string) =>
                !param.includes("=") ? `${param}: any` : param,
        );
        const nonlabeledFinishedParamsAsCombinedStr = params.join(", ");
        const labeledFinishedParamsAsCombinedStr = paramsLabeledAsAnyType.join(", ");

        const fullStr = `
        (${labeledFinishedParamsAsCombinedStr}) => {
            return new Promise((resolve) => {
                chrome.runtime.sendMessage({ type: "${fn.name}", args: [${nonlabeledFinishedParamsAsCombinedStr}] }, (response) => {
                        const maybeError = chrome.runtime.lastError;
                        if(maybeError) {
                                throw new Error(maybeError.message);
                        }
                        return resolve(response);
                });
            });
        }`;

        return fullStr;
}

export function renderDispatcherRemappingModule() {
        const allListeners = dispatcher;

        const objStr = `
{
${Object.entries(allListeners)
        .map(([key, value]) => {
                return `    ${key}: ${mapFnToChromeRuntimeSendMessage(value as (...args: any[]) => unknown)},`;
        })
        .join("\n")}
}
`;

        return `export const dispatcher = ${objStr};`;
}

if (process.argv[1]) {
        const executedFilePath = path.resolve(process.argv[1]);
        const currentFilePath = fileURLToPath(import.meta.url);

        if (executedFilePath === currentFilePath) {
                console.log(renderDispatcherRemappingModule());
        }
}
