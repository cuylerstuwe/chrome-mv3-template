import "shared/utils/logBootupDiagnostics";
import { dispatch } from "foreground/utils/dispatch";

async function main() {
	const myTime = await dispatch("fetchWorldTime");
	console.log("The current time for me is", myTime?.asFormattedTime);

	const tokyoTime = await dispatch("fetchWorldTime", "timezone/Asia/Tokyo");
	console.log("The current time in Tokyo is:", tokyoTime?.utcDatetime);
}

main().then(() => {});
