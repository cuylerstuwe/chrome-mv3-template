import "shared/utils/logBootupDiagnostics";

import { dispatcher } from "foreground/utils/dispatcher";

async function main() {
	setInterval(async () => {
		let myTime;
		try {
			myTime = await dispatcher.fetchWorldTime();
		} catch (err) {
			console.error("Couldn't dispatch. Maybe reload the page?", err);
		}
		console.log("the time in my timezone is", myTime);
	}, 5000);
}

main().then(() => {});
