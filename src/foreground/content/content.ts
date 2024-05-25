import "shared/utils/startedLog";
import { sendMessageToBackground } from "foreground/utils/sendMessageToBackground";

async function main() {
	const myTime = await sendMessageToBackground("fetchWorldTime", "ip");
	console.log("The current time for me is", myTime?.utc_datetime);

	const tokyoTime = await sendMessageToBackground("fetchWorldTime", "timezone/Asia/Tokyo");
	console.log("The current time in Tokyo is:", tokyoTime?.utc_datetime);
}

main().then(() => {});
