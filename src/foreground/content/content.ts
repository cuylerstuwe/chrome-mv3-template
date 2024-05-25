import "shared/utils/startedLog";
import { sendMessageToBackground } from "foreground/utils/sendMessageToBackground";

async function main() {
	const response = await sendMessageToBackground("sumTwoNumbers", 1, 2);
	console.log(response);
}

main().then(() => {});
