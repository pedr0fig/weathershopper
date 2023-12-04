const checkoutConstants = require('../constants/checkout.js');

module.exports = class CheckoutPage {
    checkoutText() {
        return $(`h2=${checkoutConstants.CHECKOUT}`);
    }

    tableRows() {
        return $$('table>tbody tr');
    }

    async tableData(element, index) {
        return (await element.$$('td'))[index];
    }

    total() {
        return $('#total');
    }

    payWithCardButton() {
        return $(`button=${checkoutConstants.PAY_WITH_CARD}`);
    }

    payForm() {
        return $('form .bodyView');
    }

    inputEmail() {
        return this.payForm().$('input#email');
    }

    inputCardNumber() {
        return this.payForm().$('input#card_number');
    }

    inputCardDate() {
        return this.payForm().$('input#cc-exp');
    }

    inputCardCVC() {
        return this.payForm().$('input#cc-csc');
    }

    inputZipCode() {
        return this.payForm().$('input#billing-zip');
    }

    payButton() {
        return this.payForm().$('button#submitButton');
    }

    payWithSuccess() {
        return $(`h2=${checkoutConstants.PAYMENT_SUCCESS}`);
    }
};
