import "shared/utils/startedLog";
import { sendMessageToBackground } from "foreground/sendMessageToBackground";

async function main() {
	const response = await sendMessageToBackground("sumTwoNumbers", 1, 2);
	console.log(response);
}

main().then(() => {});
