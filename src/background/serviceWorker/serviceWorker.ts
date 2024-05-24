import "../../shared/utils/startedLog";
import { handlers } from "./handlers";
import type { HandlerNames, HandlerParams, MessageFromForeground } from "../../shared/types/messageFromForegroundTypes";

async function handleMessage(type: HandlerNames, args: HandlerParams[HandlerNames]) {
	const handler = handlers[type];
	if (handler) {
		// I don't know how to type this properly right now, and it doesn't really matter.
		// The type contract is enforced by sendMessageToBackground regardless.
		// @ts-ignore
		return handler(...args);
	} else {
		throw new Error(`Handler not found: ${type}`);
	}
}

chrome.runtime.onMessage.addListener((message: MessageFromForeground, sender, sendResponse) => {
	try {
		handleMessage(message.type, message.args).then(sendResponse);
	} catch (e) {
		console.error(e);
	}
	return true;
});
