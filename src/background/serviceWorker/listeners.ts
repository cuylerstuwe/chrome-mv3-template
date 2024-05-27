import * as bundledHandlerImports from "background/listeners";

export const listeners = {
	...bundledHandlerImports,
};

export type listeners = typeof listeners;
