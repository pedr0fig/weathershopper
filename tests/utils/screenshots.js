const fs = require('fs');
const { default: AllureReporter } = require('@wdio/allure-reporter');

const screenshotsFolderPath = 'screenshots';

module.exports = class ScreenshotsUtils {
    async captureScreenshots(test) {
        const screenshotName = `${test.description.replaceAll(' ', '_')}.png`;

        // Take asynchronous screenshot, convert it from Base64 to PNG and save it in the screenshots folder.
        const screenshot = await browser.takeScreenshot();
        const fullPath = `${screenshotsFolderPath}/${screenshotName}`;
        fs.writeFileSync(fullPath, Buffer.from(screenshot, 'base64'));

        // Attach current screenshot to Allure.
        AllureReporter.addAttachment(screenshotName, Buffer.from(screenshot, 'base64'), 'image/png');

        console.info('INFO: Screenshot attached in Allure and saved at: ' + fullPath);
    }
};
