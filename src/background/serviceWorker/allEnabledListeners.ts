import * as allListenerImports from "background/listeners";

export const allEnabledListeners = {
	...allListenerImports,
};

export type listeners = typeof allEnabledListeners;
