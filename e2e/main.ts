import { Browser, Page, WebWorker } from "puppeteer";

/**
 * Main function for the e2e tests.
 * @param browser The Puppeteer browser object.
 * @param serviceWorker The service worker object from the Chrome extension.
 * @param initialTab The initial tab object to use for the tests.
 * @returns {Promise<void>}
 */
export async function main(browser: Browser, serviceWorker: WebWorker | null, initialTab: Page): Promise<void> {
	const { expect } = await import("chai");
	expect(browser).not.to.be.undefined;
	expect(serviceWorker).not.to.be.undefined;
	expect(initialTab).not.to.be.undefined;

	// Implement tests here.
}
