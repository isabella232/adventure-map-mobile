var World, chai, chaiAsPromised;
chai = require('chai');
chaiAsPromised = require('chai-as-promised');

World = function World() {
  chai.use(chaiAsPromised);
  this.expect = chai.expect;
};

module.exports = function() {
  this.setDefaultTimeout(60 * 1000);
};

module.exports.World = World;
