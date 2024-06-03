import {allMessageTypes} from "../../src/foreground/utils/allMessageTypes";

const keys = Object.keys(allMessageTypes);
const obj = Object.fromEntries(keys.map(key => [key, key]));
const objAsString = JSON.stringify(obj, null, 4);

console.log(`export const allMessageTypes = ${objAsString};\n`);