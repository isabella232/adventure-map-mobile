var myStepDefinitionsWrapper = function () {

  this.Given(/^I set the Activity "([^"]*)" to "([^"]*)"$/, function (binding, value, callback) {
    var field = browser.element(by.css('body')).element(by.model('activityData.' + binding.toLowerCase()));
    field.sendKeys(value).then(function () {
      callback();
    });
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

  this.Given(/^I create an activity "([^"]*)"$/, function (title, callback) {
    var button = browser.element(by.css('.right-buttons')).element(by.linkText('New'));
    //browser.enterRepl();
    //browser.pause();
    button.click().then(function () {
      browser.sleep(1000).then(function () {
        var title_field = browser.element(by.css('body')).element(by.css('input[placeholder="' + 'Pick a headline for your activity' + '"]'));
        title_field.sendKeys(title);
        var body_field = browser.element(by.css('body')).element(by.model('activityData.' + 'body'.toLowerCase()));
        body_field.sendKeys('This is the body');
        var slider = browser.element(by.css('body')).element(by.model('activityData.' + 'difficulty'.toLowerCase()));
        browser.actions().dragAndDrop(slider, {x: ( (1 * 100) - 100 ), y: 0}).perform();
        var select = browser.element(by.css('body')).element(by.model('activityData.' + 'category'.toLowerCase()));
        select.sendKeys('Hiking');
        var button = browser.element(by.buttonText('Create'));
        button.click().then(function () {
          browser.sleep(1000).then(function () {
            callback();
          });
        });
      });
    })

  });

  this.Given(/^I click "([^"]*)" on the right side in the navigation bar$/, function (value, callback) {
    var button = browser.element(by.css('.right-buttons')).element(by.linkText(value));
    button.click();
    browser.sleep(1000).then(function () {
      callback();
    });
  });

};

module.exports = myStepDefinitionsWrapper;
