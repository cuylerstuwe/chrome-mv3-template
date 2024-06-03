import {allEnabledListeners} from "../../src/foreground/utils/allEnabledListeners";

const keys = Object.keys(allEnabledListeners);
const obj = Object.fromEntries(keys.map(key => [key, key]));
const objAsString = JSON.stringify(obj, null, 4);

console.log(`export const allEnabledListeners = ${objAsString};\n`);