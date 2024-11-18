const PatientDataManagement = artifacts.require("PatientDataManagement");

module.exports = function (deployer) {
  deployer.deploy(PatientDataManagement);
};
