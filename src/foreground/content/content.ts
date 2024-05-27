import "shared/utils/logBootupDiagnostics";
import { dispatchToBg } from "foreground/utils/dispatchToBg";

async function main() {
	const myTime = await dispatchToBg("fetchWorldTime", "ip");
	console.log("The current time for me is", myTime?.utc_datetime);

	const tokyoTime = await dispatchToBg("fetchWorldTime", "timezone/Asia/Tokyo");
	console.log("The current time in Tokyo is:", tokyoTime?.utc_datetime);
}

main().then(() => {});
