var basicStepDefinitionsWrapper = function () {

  this.Then(/^start the debugger$/, function () {
    browser.enterRepl();
  });

  this.World = require("../support/world.js").World;

  this.Given(/^I go to "([^"]*)"$/, function (site) {
    browser.get(site);
  });

  this.Then(/^I should see an navigation bar/, function (callback) {
    this.expect(element(by.css('ion-header-bar')).isPresent()).to.eventually.equal(true)
      .and.notify(callback);
  });

  this.Then(/^the navigation bar should be "([^"]*)"$/, function (title, callback) {
    this.expect(element(by.css('ion-header-bar h1')).getText()).to.eventually.equal(title)
      .and.notify(callback);
  });

  this.Then(/^the title should be "([^"]*)"$/, function (title, callback) {
    this.expect(browser.getTitle()).to.eventually.equal(title)
      .and.notify(callback);
  });

  this.Then(/^I should see "([^"]*)"$/, function (content, callback) {
    this.expect(element(by.css('ion-content')).getText()).to.eventually.equal(content)
      .and.notify(callback);
  });
};

module.exports = basicStepDefinitionsWrapper;
