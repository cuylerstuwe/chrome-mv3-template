import "shared/utils/logBootupDiagnostics";
import {dispatch} from "foreground/utils/dispatch";

import { allMessageTypes as msg } from "foreground/utils/allMessageTypes";

async function main() {
    const myTime = await msg.fetchWorldTime();
    console.log('it worked', myTime);
}

main().then(() => {
});