const CheckoutActions = require('./checkout-actions');
const Checkout = require('../page-objects/checkout-po');
const Items = require('../page-objects/items-po');
const WebUtils = require('../utils/web-utils.js');
const itemsConstants = require('../constants/items.js');
const utils = require('../constants/utils');

const checkoutPage = new Checkout();
const itemsPage = new Items();
const webUtils = new WebUtils();

const timeout = utils.timeout;

module.exports = class ItemsActions extends CheckoutActions {
    // Get all items from the products page.
    async getAllItems() {
        const items = await itemsPage.itemsList();

        const descriptionIndex = 0;
        const priceIndex = 1;
        let itemsParsed = [];
        for (const item of items) {
            const description = await (await itemsPage.itemsText(await item, descriptionIndex)).getText();
            const fullPrice = await (await itemsPage.itemsText(await item, priceIndex)).getText();
            const price = this.parseFullPrice(fullPrice);
            const button = await itemsPage.itemsAddButton(item);
            itemsParsed.push({ name: description, price: price, addButton: await button });
        }

        // Print to console items found with relevant information.
        const itemsToPrint = itemsParsed.map(({ addButton, ...attribute }) => attribute);
        console.info('INFO: Items found on page:');
        console.info(itemsToPrint);
        return itemsParsed;
    }

    parseFullPrice(fullPrice) {
        // Remove all non-digit characters from the string, converting it to a number.
        const price = parseInt(fullPrice.replace(/\D/g, ''));
        if (isNaN(price)) {
            throw Error(`Invalid price read: ${price}`);
        } else {
            return price;
        }
    }

    // Add to the cart the cheapest item that contains the specified text.
    async addCheapestItemContaining(allItems, itemText) {
        console.info(`INFO: Finding cheapest item containing "${itemText}"...`);
        const itemsFiltered = this.filterItems(allItems, itemText);
        const cheapestItem = this.getCheapestItem(itemsFiltered);
        console.info(`INFO: Adding item "${cheapestItem.name}" with price ${cheapestItem.price}...`);
        this.addItem(cheapestItem.addButton);
        return { name: cheapestItem.name, price: cheapestItem.price };
    }

    // Filter items and return only the ones that contain the specified itemText, ignoring the case.
    filterItems(items, itemText) {
        return items.filter(item => item.name.toLowerCase().includes(itemText.toLowerCase()));
    }

    // Return the item with the low price.
    getCheapestItem(items) {
        return items.sort((a, b) => a.price - b.price).shift();
    }

    // Add the specified item to the cart.
    async addItem(item) {
        await webUtils.waitAndClick(await item, timeout);
    }

    // Validate that the cart should be empty.
    async cartShouldBeEmpty() {
        expect(await itemsPage.cart().getText()).toEqual(itemsConstants.EMPTY);
    }

    // Validate that the cart should have the specified number of items.
    async cartShouldHaveNumberOfItems(numberOfItems) {
        let cartText;
        const expecterCartText = `${numberOfItems} ${itemsConstants.CART_ITEMS}`;
        await browser.waitUntil(
            async () => {
                await itemsPage.cart().waitForDisplayed({ timeout });
                cartText = await itemsPage.cart().getText();
                return cartText === expecterCartText;
            },
            { timeout, timeoutMsg: `Cart should have text "${expecterCartText}"!"` }
        );
    }

    // Proceed to checkout.
    async proceedToCheckout() {
        await webUtils.waitAndClick(await itemsPage.cart(), timeout);
        await checkoutPage.checkoutText().waitForDisplayed();
    }
};
