const itemsConstants = require('../constants/items.js');

module.exports = class ItemsPage {
    cart() {
        return $('#cart');
    }

    moisturizersText() {
        return $(`h2=${itemsConstants.MOISTURIZERS}`);
    }

    sunscreensText() {
        return $(`h2=${itemsConstants.SUNSCREENS}`);
    }

    itemsList() {
        return $$('div.col-4');
    }

    async itemsText(element, index) {
        return (await element.$$('p'))[index];
    }

    async itemsAddButton(element) {
        return await element.$('button.btn-primary');
    }
};
