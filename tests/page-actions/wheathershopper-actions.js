const ItemsActions = require('./items-actions');
const Items = require('../page-objects/items-po');
const WeatherShopper = require('../page-objects/weathershopper-po');
const WebUtils = require('../utils/web-utils.js');
const utils = require('../constants/utils');

const items = new Items();
const weatherShopper = new WeatherShopper();
const webUtils = new WebUtils();

const timeout = utils.timeout;

module.exports = class WeatherShopperActions extends ItemsActions {
    // Open the baseUrl defined in the project configuration file (wdio.conf.js).
    async openHomePage() {
        await browser.url('');
        await weatherShopper.currentTemperatureText().waitForDisplayed();
    }

    // Return the current temperature from the webpage.
    // Temperature format example: 41 °C
    // Splitting the value by the space, and returning the first element (the numeric value).
    async getTemperature() {
        await weatherShopper.currentTemperature().waitForDisplayed();
        const temperature = parseInt((await (await weatherShopper.currentTemperature()).getText()).split(' ')[0]);
        if (isNaN(temperature)) {
            throw Error(`Invalid temperature read: ${temperature}`);
        } else {
            console.info(`INFO: Current temperature: ${temperature}`);
            return temperature;
        }
    }

    // Click in the Buy moisturizers button.
    async clickBuyMoisturizers() {
        await webUtils.waitAndClick(await weatherShopper.buyMoisturizers(), timeout);
        await items.cart().waitForDisplayed();
        await items.moisturizersText().waitForDisplayed();
    }

    // Click in the Buy sunscreens button.
    async clickBuySunscreens() {
        await webUtils.waitAndClick(await weatherShopper.buySunscreens(), timeout);
        await items.cart().waitForDisplayed();
        await items.sunscreensText().waitForDisplayed();
    }
};
