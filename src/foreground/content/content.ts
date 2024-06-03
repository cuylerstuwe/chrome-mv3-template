import "shared/utils/logBootupDiagnostics";
import {dispatch} from "foreground/utils/dispatch";

import { allEnabledListeners as listeners } from "foreground/utils/allEnabledListeners";

async function main() {
    const myTime = await dispatch(listeners.fetchWorldTime);
    console.log("The current time for me is", myTime?.asFormattedTime);

    const tokyoTime = await dispatch(listeners.fetchWorldTime, "timezone/Asia/Tokyo");
    console.log("The current time in Tokyo is:", tokyoTime?.utcDatetime);
}

main().then(() => {
});