const WebPage = require('../page-objects/web-po');

const webPage = new WebPage();

module.exports = class WebUtils {
    // Switch back to the main page.
    async switchToFrameNull() {
        await browser.switchToFrame(null);
    }

    // Select the payment form frame.
    async selectPayFormFrame() {
        await (await webPage.payFormFrame()).waitForDisplayed();
        await browser.switchToFrame(await webPage.payFormFrame());
    }

    // Generic function used to perform button clicks.
    async waitAndClick(element, timeout) {
        await element.waitForClickable({ timeout });
        await element.waitForDisplayed();
        await element.waitForEnabled();
        await element.click();
    }

    // Input text char by char (slowly). Used when the "setValue" does not work as expected.
    async sendKeysInElement(element, textToEnter, timeout) {
        await element.waitForDisplayed({ timeout });
        await element.click();
        for (const char of textToEnter) {
            await browser.pause(200);
            await browser.keys(char);
        }
    }
};
