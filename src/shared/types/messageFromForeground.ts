import type { listeners } from "background/serviceWorker/listeners";

export type ListenerNames = keyof typeof listeners;

export type ListenerParams = {
	[key in ListenerNames]: Parameters<(typeof listeners)[key]>;
};

export type MessageFromForeground = {
	type: ListenerNames;
	args: ListenerParams[ListenerNames];
};
