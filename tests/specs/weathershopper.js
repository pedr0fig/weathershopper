const WeatherShopper = require('../page-actions/wheathershopper-actions.js');

const card = require('../constants/card.js');
const itemsConstants = require('../constants/items.js');
const weatherShopperConstants = require('../constants/weathershopper.js');

const ALOE = itemsConstants.ALOE;
const ALMOND = itemsConstants.ALMOND;
const SPF30 = itemsConstants.SPF30;
const SPF50 = itemsConstants.SPF50;
const MIN_TEMP = weatherShopperConstants.MIN_TEMPERATURE;
const MAX_TEMP = weatherShopperConstants.MAX_TEMPERATURE;

describe('WeatherShopper challenge', () => {
    let weatherShopper, itemOne, itemTwo;
    const ONE_ITEM = 1;
    const TWO_ITEMS = 2;

    beforeAll(async () => {
        weatherShopper = new WeatherShopper();
        await weatherShopper.openHomePage();
    });

    it(`should buy moisturizers if temperature is below ${MIN_TEMP} or sunscreens if above ${MAX_TEMP} degrees`, async () => {
        temperature = await weatherShopper.getTemperature();

        // Do nothing if temperature is not below or above the specified values.
        if (temperature >= MIN_TEMP && temperature <= MAX_TEMP) {
            console.info(
                `INFO: 😌 Temperature is between ${MIN_TEMP} and ${MAX_TEMP} degrees. No need to buy moisturizers or sunscreens!`
            );
        } else {
            // Buy moisturizers if temperature is below the minimum value.
            if (temperature < weatherShopperConstants.MIN_TEMPERATURE) {
                console.info(`INFO: 🥶 Temperature is below ${MIN_TEMP} degrees. Buying moisturizers...`);
                await weatherShopper.clickBuyMoisturizers();
                await weatherShopper.cartShouldBeEmpty();
                const allItems = await weatherShopper.getAllItems();
                itemOne = await weatherShopper.addCheapestItemContaining(allItems, ALOE);
                await weatherShopper.cartShouldHaveNumberOfItems(ONE_ITEM);
                itemTwo = await weatherShopper.addCheapestItemContaining(allItems, ALMOND);
                await weatherShopper.cartShouldHaveNumberOfItems(TWO_ITEMS);
            } else if (temperature > MAX_TEMP) {
                // Buy sunscreens if temperature is above the maximum value.
                console.info(`INFO: 😎 Temperature is above ${MAX_TEMP} degrees. Buying sunscreens...`);
                await weatherShopper.clickBuySunscreens();
                await weatherShopper.cartShouldBeEmpty();
                const allItems = await weatherShopper.getAllItems();
                itemOne = await weatherShopper.addCheapestItemContaining(allItems, SPF50);
                await weatherShopper.cartShouldHaveNumberOfItems(ONE_ITEM);
                itemTwo = await weatherShopper.addCheapestItemContaining(allItems, SPF30);
                await weatherShopper.cartShouldHaveNumberOfItems(TWO_ITEMS);
            }
            // Validate items and pay.
            await weatherShopper.proceedToCheckout();
            const totalAmount = await weatherShopper.checkoutItemsShouldContain([itemOne, itemTwo]);
            await weatherShopper.payWithCard(totalAmount, card.email, card.number, card.date, card.cvc, card.zip);
        }
    });
});
