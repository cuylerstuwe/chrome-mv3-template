import * as bundledHandlerImports from "background/handlers";

export const handlers = {
	...bundledHandlerImports,
};

export type handlers = typeof handlers;
