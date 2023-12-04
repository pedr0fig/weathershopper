module.exports = class WebPage {
    payFormFrame() {
        return $('iframe[name=stripe_checkout_app]');
    }
};
