var myHooks = function () {
  this.Before('@network', function (scenario, callback) {
    callback();
  });

  this.Before(function(scenario, callback) {
    browser.restart();
    browser.manage().timeouts().pageLoadTimeout(40000);
    browser.manage().timeouts().implicitlyWait(40000);
    browser.manage().window().setSize(260, 900);
    callback();
  });

  this.After(function(scenario, callback) {
    console.log('Scenario is successful: ' + scenario.isSuccessful());
    callback();
  });
};

module.exports = myHooks;
