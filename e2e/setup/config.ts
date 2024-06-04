const { executablePath } = require("puppeteer");
const path = require("path");

export const pathToDevelopmentExtension = path.join(process.cwd(), "build-dev");

const seconds = (n: number) => n * 1000;

const MAX_SIGNED_32BIT_INT = 2147483647;
const TIMEOUT_EFFECTIVELY_FOREVER = MAX_SIGNED_32BIT_INT;
void TIMEOUT_EFFECTIVELY_FOREVER;

const MBP_13_INCH_DEFAULT_SCREEN_SIZE = {
	width: 1280,
	height: 800,
};

const MACOS_STANDARD_CHROME_PADDING_SIZE_PX = {
	horizontal: 0,
	vertical: 80,
};

const MACOS_CHROME_FOR_TESTING_PADDING_SIZE_PX = {
	horizontal: 0,
	vertical: 170,
};

const shouldUseChromeForTesting = true;

const chromePaddingFudgeFactor = shouldUseChromeForTesting
	? MACOS_CHROME_FOR_TESTING_PADDING_SIZE_PX
	: MACOS_STANDARD_CHROME_PADDING_SIZE_PX;

export const config = {
	shouldBeHeadless: false,

	/**
	 * This calculates the default path to the binary installed by `puppeteer`.
	 * NOTE: You might have to self-sign this executable to bypass macOS's Gatekeeper and/or firewall.
	 */
	chromeForTestingExecutablePath: executablePath(),

	standardChromeOsxExecutablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",

	shouldUseChromeForTesting,

	/**
	 * This is effectively the maximum amount of time we will wait for a page to load and for extension to look for fields
	 * before we decide that something is wrong and fail the test.
	 *
	 * By default, Puppeteer will wait for 30 seconds for any given async function before timing out and throwing an error.
	 */
	maximumWaitTime: seconds(30),
	displaySize: {
		width: MBP_13_INCH_DEFAULT_SCREEN_SIZE.width + chromePaddingFudgeFactor.horizontal,
		height: MBP_13_INCH_DEFAULT_SCREEN_SIZE.height + chromePaddingFudgeFactor.vertical,
	},
};
