const CheckoutPage = require('../page-objects/checkout-po.js');
const WebUtils = require('../utils/web-utils.js');
const checkoutConstants = require('../constants/checkout.js');
const utils = require('../constants/utils.js');

const checkoutPage = new CheckoutPage();
const webUtils = new WebUtils();

const timeout = utils.timeout;
const twoDecimalPlaces = 2;

module.exports = class CheckoutActions {
    // Validate that the checkout items are the expected ones (description and price).
    async checkoutItemsShouldContain(expectedItems) {
        console.info(`INFO: Validating checkout items...`);
        const checkoutItems = await this.getCheckoutItems();

        // Validate number of expected and found items in checkout page
        if (checkoutItems.length !== expectedItems.length) {
            throw Error(
                `Number of items in checkout page are different than expected. Expected "${expectedItems.length}" but found "${checkoutItems.length}"!`
            );
        }

        // Sorting all items by name.
        // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
        checkoutItems.sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        });
        expectedItems.sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        });

        // Validate that each item on checkout page is expected.
        if (JSON.stringify(expectedItems) !== JSON.stringify(checkoutItems)) {
            throw Error(
                `Items in checkout page are different than expected. Expected "${JSON.stringify(
                    expectedItems
                )}" but found "${JSON.stringify(checkoutItems)}"!`
            );
        }

        const totalAmount = await this.validateTotal(checkoutItems);
        return totalAmount;
    }

    // Return an array with an object for each of the items in the checkout page table.
    async getCheckoutItems() {
        const checkoutItems = await checkoutPage.tableRows();

        const descriptionIndex = 0;
        const priceIndex = 1;
        let checkoutItemsParsed = [];
        for (const checkoutItem of checkoutItems) {
            const description = await (await checkoutPage.tableData(await checkoutItem, descriptionIndex)).getText();
            const price = await (await checkoutPage.tableData(await checkoutItem, priceIndex)).getText();
            checkoutItemsParsed.push({ name: description, price: parseInt(price) });
        }
        return checkoutItemsParsed;
    }

    // Validate total amount.
    async validateTotal(items) {
        const totalAmount = items.reduce((accumulator, object) => {
            return accumulator + parseInt(object.price);
        }, 0);
        expect(await checkoutPage.total().getText()).toEqual(`${checkoutConstants.TOTAL} ${totalAmount}`);
        return totalAmount;
    }

    // Perform the payment from the checkout page.
    async payWithCard(totalAmount, card_email, card_number, card_date, card_cvc, card_zip) {
        console.info(`INFO: Performing payment...`);
        await webUtils.waitAndClick(await checkoutPage.payWithCardButton(), timeout);
        await webUtils.selectPayFormFrame();
        await checkoutPage.payForm().waitForDisplayed();
        // Required sleep to avoid losing focus while filling in the inputs.
        await browser.pause(1000);

        await checkoutPage.inputEmail().waitForDisplayed();
        await checkoutPage.inputEmail().setValue(card_email);

        await checkoutPage.inputCardNumber().waitForDisplayed();
        await webUtils.sendKeysInElement(await checkoutPage.inputCardNumber(), card_number, timeout);

        await checkoutPage.inputCardDate().waitForDisplayed();
        await webUtils.sendKeysInElement(await checkoutPage.inputCardDate(), card_date, timeout);

        await checkoutPage.inputCardCVC().waitForDisplayed();
        await checkoutPage.inputCardCVC().setValue(card_cvc);

        await checkoutPage.inputZipCode().waitForDisplayed();
        await checkoutPage.inputZipCode().setValue(card_zip);

        expect(await checkoutPage.payButton().getText()).toEqual(
            `${checkoutConstants.PAY_INR}${parseFloat(totalAmount).toFixed(twoDecimalPlaces)}`
        );

        await webUtils.waitAndClick(await checkoutPage.payButton(), timeout);
        await webUtils.switchToFrameNull();
        await checkoutPage.payWithSuccess().waitForDisplayed();
    }
};
