import type { handlers } from "../../background/serviceWorker/handlers";

export type HandlerNames = keyof typeof handlers;

export type HandlerParams = {
	[key in HandlerNames]: Parameters<(typeof handlers)[key]>;
};

export type MessageFromForeground = {
	type: HandlerNames;
	args: HandlerParams[HandlerNames];
};
