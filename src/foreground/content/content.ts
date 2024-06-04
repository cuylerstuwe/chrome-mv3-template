import "shared/utils/logBootupDiagnostics";

import { allMessageTypes } from "foreground/utils/allMessageTypes";

const { fetchWorldTime } = allMessageTypes;

async function main() {
    const myTime = await fetchWorldTime();
    console.log('the time in my timezone is', myTime);
}

main().then(() => {});