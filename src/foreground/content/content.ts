import "shared/utils/logBootupDiagnostics";
import {dispatch} from "foreground/utils/dispatch";

import { allMessageTypes as msg } from "foreground/utils/allMessageTypes";

async function main() {
    const myTime = await dispatch(msg.fetchWorldTime);
    console.log("The current time for me is", myTime?.asFormattedTime);

    const tokyoTime = await dispatch(msg.fetchWorldTime, "timezone/Asia/Tokyo");
    console.log("The current time in Tokyo is:", tokyoTime?.utcDatetime);
}

main().then(() => {
});