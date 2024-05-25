import { noop } from "background/handlers/noop";
import { sumTwoNumbers } from "background/handlers/sumTwoNumbers";

export const handlers = {
	noop,
	sumTwoNumbers,
};

export type handlers = typeof handlers;
