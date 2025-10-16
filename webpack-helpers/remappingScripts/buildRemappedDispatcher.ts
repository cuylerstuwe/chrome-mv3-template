import { dispatcher } from "../../src/foreground/utils/dispatcher";

function $params(func: any) {
        return (func + "")
                .replace(/[/][/].*$/gm, "")
                .replace(/\s+/g, "")
                .replace(/[/][*][^/*]*[*][/]/g, "")
                .split("){", 1)[0]
                .replace(/^[^(]*[(]/, "")
                .replace(/=[^,]+/g, "")
                .split(",")
                .filter(Boolean);
}

function $paramsWithDefaults(func: any) {
        return (func + "")
                .replace(/[/][/].*$/gm, "")
                .replace(/\s+/g, "")
                .replace(/[/][*][^/*]*[*][/]/g, "")
                .split("){", 1)[0]
                .replace(/^[^(]*[(]/, "")
                .split(",")
                .filter(Boolean);
}

function mapFnToChromeRuntimeSendMessage(fn: any) {
        const params = $params(fn);
        const paramsWithDefaults = $paramsWithDefaults(fn)!;
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

export function buildRemappedDispatcherSource() {
        const objStr = `
{
${Object.entries(dispatcher)
        .map(([key, value]) => {
                return `    ${key}: ${mapFnToChromeRuntimeSendMessage(value)},`;
        })
        .join("\n")}
}
`;

        return `export const dispatcher = ${objStr};`;
}
