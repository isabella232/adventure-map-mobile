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
    var link = browser.element(by.css('body')).element(by.linkText(element));
    link.click();
    browser.sleep(1000).then(function () {
      callback();
    });

  });

  this.Given(/^I am logged in as "([^"]*)" with password "([^"]*)"$/, function (username, password, callback) {
    var loginNavigateButton = browser.element(by.linkText("LOGIN"));
    var emailField = browser.element(by.model('credentials.email'));
    var passwordField = browser.element(by.model('credentials.password'));
    var loginButton = browser.element(by.buttonText("LOGIN"));
    loginNavigateButton.click().then(function () {
      emailField.sendKeys(username);
      passwordField.sendKeys(password);
      loginButton.click().then(function () {
        browser.sleep(1000).then(function () {
          callback();
        });
      });
    });
  });

  this.Given(/^I login using Facebook as "([^"]*)" and password "([^"]*)"$/, function (username, password, callback) {
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
    browser.sleep(1000).then(function () {
      callback();
    });
  });

  this.Given(/^I wait for the application to load$/, function (callback) {
    browser.sleep(3000).then(function () {
      callback();
    });
  });

  this.Given(/^I enter "([^"]*)" as password$/, function (password, callback) {
    var passwordField = browser.element(by.model('credentials.password'));
    passwordField.sendKeys(password).then(function () {
      callback();
    });
  });

  this.Given(/^I enter "([^"]*)" as email$/, function (email, callback) {
    var emailField = browser.element(by.model('credentials.email'));
    emailField.sendKeys(email).then(function () {
      callback();
    });
  });

  this.Given(/^I click button "([^"]*)"$/, function (element, callback) {
    var button = browser.element(by.buttonText(element));
    button.click().then(function () {
      callback();
    });
  });

  this.Given(/^I click on the toggle menu button$/, function (callback) {
    var button = browser.element(by.css('.left-buttons')).element(by.css('.button'));
    button.click().then(function () {
      callback();
    });
  });

  this.Given(/^I select "([^"]*)"$/, function (element, callback) {
    browser.driver.manage().window().maximize();
    var button = browser.element.all(by.cssContainingText('ion-item', element)).last(),
      EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(button), 5000);
    if (button.isDisplayed()) {
      button.click().then(function () {
        callback();
      });
    }
  });

  this.Given(/^I click on the "([^"]*)" menu button$/, function (element, callback) {
    var menuButton = browser.element(by.css('.left-buttons')).element(by.css('.button'));
    menuButton.click().then(function () {
      browser.sleep(5000);
      var button = browser.element(by.css('ion-list')).element(by.cssContainingText('ion-item', element));
      button.click().then(function () {
        callback();
      });
    });

  });


  this.Given(/^I am logged out$/, function (callback) {
    var menuButton = browser.element(by.css('.left-buttons')).element(by.css('.button'));
    var profileButton = browser.element.all(by.cssContainingText('ion-item', 'Profile')).last();
    EC = protractor.ExpectedConditions;
    //browser.wait(EC.visibilityOf(profileButton), 5000);


    menuButton.click().then(function () {
      profileButton.click().then(function () {
        var logoutButton = browser.element.all(by.buttonText('Logout')).last();
        //browser.wait(EC.visibilityOf(logoutButton), 5000);
        logoutButton.click().then(function () {
          callback();
        });
      });
    });

  });

};

module.exports = basicStepDefinitionsWrapper;
