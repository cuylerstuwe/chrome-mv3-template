import type { allEnabledListeners } from "background/serviceWorker/allEnabledListeners";
import type { ListenerNames, ListenerParams, MessageFromForeground } from "shared/types/messageFromForeground";

export function dispatchToBg<K extends ListenerNames>(type: K, ...args: ListenerParams[K]) {
	return new Promise((resolve) => {
		chrome.runtime.sendMessage({ type, args } as MessageFromForeground, resolve);
	}) as ReturnType<allEnabledListeners[K]>;
}
