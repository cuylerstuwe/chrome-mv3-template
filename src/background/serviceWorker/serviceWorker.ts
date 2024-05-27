import "shared/utils/logBootupDiagnostics";
import { allEnabledListeners } from "background/serviceWorker/allEnabledListeners";
import type { ListenerNames, ListenerParams, MessageFromForeground } from "shared/types/messageFromForeground";

/**
 * Thin wrapper around allEnabledListeners to route messages from the foreground with async/await syntax.
 * @param type The .type property on the message object from the foreground.
 * @param args The .args property on the message object from the foreground.
 */
async function routeMessage(type: ListenerNames, args: ListenerParams[ListenerNames]) {
	const correspondingListener = allEnabledListeners[type];
	if (correspondingListener) {
		/**
		 * I don't know how to type this properly right now, and it doesn't really matter.
		 * The type contract is enforced by dispatchToBg regardless,
		 * so "hacking" this should be safe as long as all messages are sent via that function.
		 * @see https://github.com/microsoft/TypeScript/issues/49802
		 */
		return (correspondingListener as any)(...args);
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
