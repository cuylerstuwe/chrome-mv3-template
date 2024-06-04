import * as allListenerImports from "background/listeners";

/**
 * Exposes all of the listeners to the foreground.

 * Under the hood, each of these is converted during the build process
 * to an anonymous function that sends a message to the background.
 */
export const dispatcher = {
	...allListenerImports,
};
