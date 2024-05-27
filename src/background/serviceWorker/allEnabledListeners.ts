import * as allListenerImports from "background/listeners";

export const allEnabledListeners = {
	...allListenerImports,
};

export type allEnabledListeners = typeof allEnabledListeners;
