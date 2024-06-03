import "shared/utils/logBootupDiagnostics";
import {dispatch} from "foreground/utils/dispatch";

import { allMessageTypes as messageTypes } from "foreground/utils/allMessageTypes";

async function main() {
    const myTime = await dispatch(messageTypes.fetchWorldTime);
    console.log("The current time for me is", myTime?.asFormattedTime);

    const tokyoTime = await dispatch(messageTypes.fetchWorldTime, "timezone/Asia/Tokyo");
    console.log("The current time in Tokyo is:", tokyoTime?.utcDatetime);
}

main().then(() => {
});