var basicStepDefinitionsWrapper = function () {

  this.World = require("../support/world.js").World;

  this.Then(/^start the debugger$/, function (callback) {
    browser.enterRepl();
    callback();
  });

  this.Then(/^pause the browser$/, function (callback) {
    browser.pause();
    callback();
  });

  this.Given(/^I go to "([^"]*)"$/, function (site, callback) {
    browser.get(site).then(function () {
      browser.sleep(3000).then(function () {
        callback();
      });
    });

  });

  this.Given(/^I open the app$/, function (callback) {
    browser.ignoreSynchronization = true;
    browser.get('http://localhost:8100/#/');
    callback();
  });

  this.Given(/^I fill in "([^"]*)" with "([^"]*)"$/, function (element, value, callback) {
    var field = browser.element(by.css('body')).element(by.css('input[placeholder="' + element + '"]'));
    field.sendKeys(value).then(function () {
      callback();
    });
  });


  this.Then(/^I click "([^"]*)"$/, function (element, callback) {
    var button = browser.element(by.css('body')).element(by.buttonText(element));
    button.click();
    browser.sleep(1000).then(function () {
      callback();
    });

  });

  this.Given(/^I am logged in as "([^"]*)" with password "([^"]*)"$/, function (username, password, callback) {
    var loginNavigateButton = browser.element(by.linkText("LOGIN"));
    var emailField = browser.element(by.model('credentials.email'));
    var passwordField = browser.element(by.model('credentials.password'));
    var loginButton = browser.element(by.buttonText("LOGIN"));
    loginNavigateButton.click().then(function(){
      emailField.sendKeys(username);
      passwordField.sendKeys(password);
      loginButton.click().then(function(){
        browser.sleep(1000).then(function () {
          callback();
        });
      });
    });
  });

  this.Given(/^I login using Facebook as "([^"]*)" and password "([^"]*)"$/, function (username, password, callback) {
    var button = browser.element(by.buttonText("Login with Facebook"));
    button.click()
      .then(function () {
        browser.ignoreSynchronization = true;
        browser.getAllWindowHandles()
          .then(function (handles) {
            browser.switchTo().window(handles[1])
              .then(function () {
                //do your stuff on the pop up window
                browser.element(by.id('email')).sendKeys(username);
                browser.element(by.id('pass')).sendKeys(password);
                browser.element(by.id('loginbutton')).click();
              })
              .then(function () {
                // back to app
                browser.switchTo().window(handles[0]);
                browser.ignoreSynchronization = false;
              });
          });
      });
    browser.sleep(1000).then(function () {
      callback();
    });
  });

  this.Given(/^I wait for the application to load$/, function (callback) {
    browser.sleep(3000).then(function () {
      callback();
    });
  });
};

module.exports = basicStepDefinitionsWrapper;
