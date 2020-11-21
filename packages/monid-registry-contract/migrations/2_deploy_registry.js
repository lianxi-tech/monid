const Registry = artifacts.require('Registry');

module.exports = (deployer) => {
  deployer.deploy(Registry).then(() => {
    console.log('Registry deployed at: ', Registry.address);
  });
};
