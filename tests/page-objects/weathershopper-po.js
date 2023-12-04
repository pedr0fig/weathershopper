const weatherShopperConstants = require('../constants/weathershopper.js');

module.exports = class Page {
    currentTemperatureText() {
        return $(`h2=${weatherShopperConstants.CURRENT_TEMPERATURE}`);
    }

    currentTemperature() {
        return $('#temperature');
    }

    buyMoisturizers() {
        return $(`button=${weatherShopperConstants.BUY_MOISTURIZERS}`);
    }

    buySunscreens() {
        return $(`button=${weatherShopperConstants.BUY_SUNSCREENS}`);
    }
};
