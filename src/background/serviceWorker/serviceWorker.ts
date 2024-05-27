import "shared/utils/startedLog";
import { listeners } from "background/serviceWorker/listeners";
import type { ListenerNames, ListenerParams, MessageFromForeground } from "shared/types/messageFromForeground";

async function routeMessage(type: ListenerNames, args: ListenerParams[ListenerNames]) {
	const correspondingListener = listeners[type];
	if (correspondingListener) {
		// I don't know how to type this properly right now, and it doesn't really matter.
		// The type contract is enforced by dispatchToBg regardless.
		// @ts-ignore
		return correspondingListener(...args);
	} else {
		throw new Error(`Listener not found: ${type}`);
	}
}

chrome.runtime.onMessage.addListener((message: MessageFromForeground, sender, sendResponse) => {
	try {
		routeMessage(message.type, message.args).then(sendResponse);
	} catch (e) {
		console.error(e);
	}
	return true;
});
