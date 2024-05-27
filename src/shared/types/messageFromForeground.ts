import type { allEnabledListeners } from "background/serviceWorker/allEnabledListeners";

export type ListenerNames = keyof typeof allEnabledListeners;

export type ListenerParams = {
	[key in ListenerNames]: Parameters<(typeof allEnabledListeners)[key]>;
};

export type MessageFromForeground = {
	type: ListenerNames;
	args: ListenerParams[ListenerNames];
};
