import * as allListenerImports from "background/listeners";

export const listeners = {
	...allListenerImports,
};

export type listeners = typeof listeners;
