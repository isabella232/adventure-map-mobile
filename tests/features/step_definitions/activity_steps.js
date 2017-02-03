var myStepDefinitionsWrapper = function () {

  this.Given(/^I set the Activity "([^"]*)" to "([^"]*)"$/, function (binding, value, callback) {
    var field = browser.element(by.css('body')).element(by.model('activityData.' + binding.toLowerCase()));
    field.sendKeys(value);
    callback();
  });

  this.Given(/^I slide "([^"]*)" to "([^"]*)"$/, function (binding, value, callback) {
    var slider = browser.element(by.css('body')).element(by.model('activityData.' + binding.toLowerCase()));
    browser.actions().dragAndDrop(slider, {x: ( (value * 100) - 100 ), y: 0}).perform();
    callback();
  });

  this.Given(/^I select Activity "([^"]*)" to "([^"]*)"$/, function (binding, value, callback) {
    var select = browser.element(by.css('body')).element(by.model('activityData.' + binding.toLowerCase()));
    select.sendKeys(value);
    callback();
  });
};
module.exports = myStepDefinitionsWrapper;
