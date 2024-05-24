import type { handlers } from "../background/handlers/handlers";
import type { HandlerNames, HandlerParams, MessageFromForeground } from "../shared/types/messageFromForegroundTypes";

export function sendMessageToBackground<K extends HandlerNames>(
	type: K,
	...args: HandlerParams[K]
): Promise<ReturnType<(typeof handlers)[K]>> {
	return new Promise((resolve) => {
		chrome.runtime.sendMessage({ type, args }, resolve);
	});
}
