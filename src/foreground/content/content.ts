import "shared/utils/startedLog";
import { sendMessageToBackground } from "foreground/utils/sendMessageToBackground";

async function main() {
	const response = await sendMessageToBackground("sumTwoNumbers", 1, 2);
	console.log(response);
	const worldTime = await sendMessageToBackground("fetchWorldTime");
	console.log("the time is", worldTime.unixtime);
}

main().then(() => {});
