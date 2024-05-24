import { noop } from "../handlers/noop";
import { sumTwoNumbers } from "../handlers/sumTwoNumbers";

export const handlers = {
	noop,
	sumTwoNumbers,
};

export type handlers = typeof handlers;
