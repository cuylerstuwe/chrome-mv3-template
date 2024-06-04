import { dispatcher } from "../../src/foreground/utils/dispatcher";

function $params(func: any) {
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

function $paramsWithDefaults(func: any) {
	return (func + "")
		.replace(/[/][/].*$/gm, "") // strip single-line comments
		.replace(/\s+/g, "") // strip white space
		.replace(/[/][*][^/*]*[*][/]/g, "") // strip multi-line comments
		.split("){", 1)[0]
		.replace(/^[^(]*[(]/, "") // extract the parameters
		.split(",")
		.filter(Boolean); // split & filter [""]
}

function mapFnToChromeRuntimeSendMessage(fn: any) {
	const params = $params(fn);
	const paramsWithDefaults = $paramsWithDefaults(fn)!;
	const paramsLabeledAsAnyType = paramsWithDefaults.map((param: string) =>
		!param.includes("=") ? `${param}: any` : param,
	);
	const nonlabeledFinishedParamsAsCombinedStr = params.join(", ");
	const labeledFinishedParamsAsCombinedStr = paramsLabeledAsAnyType.join(", ");
	const sendMessageCommand = `chrome.runtime.sendMessage({type: "${fn.name}", args: [${nonlabeledFinishedParamsAsCombinedStr}]})`;
	// const fnBodyStr = `(${labeledFinishedParamsAsCombinedStr}) => ${sendMessageCommand}`;

	const fullStr = `
        (${labeledFinishedParamsAsCombinedStr}) => {
            return new Promise((resolve) => {
                chrome.runtime.sendMessage({ type: "${fn.name}", args: [${nonlabeledFinishedParamsAsCombinedStr}] }, resolve);
            });
        }`;

	return fullStr;
}

const allListeners = dispatcher;

const objStr = `
{
${Object.entries(allListeners)
	.map(([key, value]) => {
		return `    ${key}: ${mapFnToChromeRuntimeSendMessage(value)},`;
	})
	.join("\n")}
}
`;

const exportStr = `export const dispatcher = ${objStr};`;

console.log(exportStr);
