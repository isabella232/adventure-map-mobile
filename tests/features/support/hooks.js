var myHooks = function () {
  this.Before('@network', function (scenario, callback) {
    callback();
  });

  this.After(function(scenario, callback) {
    console.log('Scenario is successful: ' + scenario.isSuccessful());
    callback();
  });
};

module.exports = myHooks;
