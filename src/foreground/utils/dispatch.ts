import type { allEnabledListeners, AllListenerShapes } from "background/serviceWorker/allEnabledListeners";
import type { ListenerNames, ListenerParams, MessageFromForeground } from "shared/types/messageFromForeground";

export function dispatch<K extends AllListenerShapes>(type: K, ...args: Parameters<K>) {
	return new Promise((resolve) => {
		/**
		 * In the interest of getting useful type information, we accept `type` as a direct reference to a listener,
		 * but we use build tools to remap it to a string.
		 *
		 * This allows us to pass direct references to functions in the foreground, so we can use them for "goto definition".
		 *
		 * WebStorm doesn't need this workaround (e.g., e104263 enables effective "goto definition" from string types).
		 * VSCode isn't as clever, though, and doesn't make any inference from strings that can be used for "goto definition".
		 */
		chrome.runtime.sendMessage({ type, args }, resolve);
	}) as ReturnType<K>;
}