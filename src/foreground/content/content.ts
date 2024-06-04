import "shared/utils/logBootupDiagnostics";

import { dispatcher } from "foreground/utils/dispatcher";

async function main() {
	const myTime = await dispatcher.fetchWorldTime();
	console.log("the time in my timezone is", myTime);
}

main().then(() => {});
