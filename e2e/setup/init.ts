import { Target } from "puppeteer";

import puppeteer from "puppeteer-extra";

import StealthPlugin from "puppeteer-extra-plugin-stealth";

import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";
puppeteer.use(
	RecaptchaPlugin({
		provider: {
			id: "2captcha",
			token: "XXXXXXX", // We're not actually using this, but it's required by the plugin. Right now we're just detecting (rather than solving) captchas.
		},
		visualFeedback: true,
	}),
);

import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

import { config, pathToDevelopmentExtension } from "./config";

import { main } from "../main";

async function init() {
	const browser = await puppeteer.launch({
		args: [
			`--disable-extensions-except=${pathToDevelopmentExtension}`,
			`--load-extension="${pathToDevelopmentExtension}"`,
			config.shouldBeHeadless ? "" : `--window-size=${config.displaySize.width},${config.displaySize.height}`,
			// '--no-sandbox', // Not recommended for security reasons, but could be required for some Linux environments (e.g., some CI environments). See: https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#setting-up-chrome-linux-sandbox
		],

		/**
		 * `defaultViewport: null` causes the viewport to be set to the full size of the window.
		 * This makes the headful browser's usage a bit less awkward.
		 */
		defaultViewport: config.shouldBeHeadless ? undefined : null,

		/**
		 * The value of `headless` needs to be either `"new"` or `false` in order for the extension to be loaded.
		 * Setting it to `true` loads an alternative binary that's similar to Chrome, but which does not support extensions.
		 * Set it to `false` while debugging the E2E framework or while testing it with new sites to see what's happening.
		 * NOTE: Our Typescript types don't know about the recently released `"new"` value, so we're ignoring Typescript here.
		 */
		// @ts-ignore
		headless: config.shouldBeHeadless ? "new" : false,
		executablePath: config.shouldUseChromeForTesting
			? config.chromeForTestingExecutablePath
			: config.standardChromeOsxExecutablePath,
	});

	console.log("Browser launched! Waiting for background page...");

	const serviceWorkerTarget = await browser.waitForTarget((target: Target) => target.type() === "service_worker");
	const serviceWorker = await serviceWorkerTarget.worker();
	void serviceWorker;

	console.log("Service worker loaded! Opening new tab...");

	try {
		const newTab = await browser.newPage();
		if (config.shouldBeHeadless) {
			await newTab.setViewport({
				width: config.displaySize.width,
				height: config.displaySize.height,
			});
		}

		await newTab.waitForNetworkIdle();

		console.log("New tab opened! Running tests...");

		await main(browser, serviceWorker, newTab);

		await newTab.close();
	} catch (err) {
		console.error(err);
	}

	await browser.close();
}

init().then(() => {
	console.log("E2E tests finished.");
});
