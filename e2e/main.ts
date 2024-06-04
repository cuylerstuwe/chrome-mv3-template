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
	if (browser === null) {
		throw new Error('The "browser" object is null, when it was expected not to be.');
	}

	expect(serviceWorker).not.to.be.undefined;
	if (serviceWorker === null) {
		throw new Error('The "serviceWorker" object is null, when it was expected not to be.');
	}

	expect(initialTab).not.to.be.undefined;
	if (initialTab === null) {
		throw new Error('The "initialTab" object is null, when it was expected not to be.');
	}

	expect(serviceWorker.url()).to.be.a("string");
	expect(serviceWorker.url()).to.have.length.greaterThan(0);
	expect(serviceWorker.url()).to.include("chrome-extension://");
	expect(serviceWorker.url()).to.include("serviceWorker.js");

	// Implement tests here.
}
