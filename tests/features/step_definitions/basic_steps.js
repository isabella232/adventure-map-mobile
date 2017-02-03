var basicStepDefinitionsWrapper = function () {

  this.World = require("../support/world.js").World;

  this.Then(/^start the debugger$/, function () {
    browser.enterRepl();
  });

  this.Then(/^pause the browser$/, function (callback) {
    browser.pause();
    callback();
  });

  this.Given(/^I go to "([^"]*)"$/, function (site, callback) {
    browser.get(site);
    callback();
  });

  this.Given(/^I open the app$/, function (callback) {
    browser.get('');
    callback();
  });

  this.Given(/^I fill in "([^"]*)" with "([^"]*)"$/, function (element, value, callback) {
    var field = browser.element(by.css('body')).element(by.css('input[placeholder="' + element + '"]'));
    field.sendKeys(value);
    callback();
  });

  this.Given(/^I click "([^"]*)"$/, function (element, callback) {
    var button = browser.element(by.buttonText(element));
    button.click().then(function(){
      callback();
    });

  });

  this.Given(/^I am logged in as "([^"]*)" with password "([^"]*)"$/, function (username, password, callback) {
    var emailField = browser.element(by.css('body')).element(by.css('input[placeholder="Email"]'));
    var passwordField = browser.element(by.css('body')).element(by.css('input[placeholder="Password"]'));
    var loginButton = browser.element(by.buttonText("Login"));
    emailField.sendKeys(username);
    passwordField.sendKeys(password);
    loginButton.click();
    callback();
  });


};

module.exports = basicStepDefinitionsWrapper;
