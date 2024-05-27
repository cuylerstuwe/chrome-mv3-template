/**
 * This is a barrel file that exports every listener.
 *
 * Whichever listeners are exported here will be registered by the service worker,
 * and will be typed and callable from foreground scripts.
 */

export { sumTwoNumbers } from "./functions/sumTwoNumbers";
export { fetchWorldTime } from "./functions/fetchWorldTime";
