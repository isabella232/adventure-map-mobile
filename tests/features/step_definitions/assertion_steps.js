var assertionStepDefinitionsWrapper = function () {

  this.Then(/^I should be on the "([^"]*)" page$/, function (page, callback) {
    // browser.enterRepl();
    this.expect(browser.getCurrentUrl()).to.eventually.equal(browser.baseUrl + "#/" + page)
      .and.notify(callback);
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
    this.expect(element(by.css('body')).getText()).to.eventually.contain(content)
      .and.notify(callback);
  });
};
module.exports = assertionStepDefinitionsWrapper;
