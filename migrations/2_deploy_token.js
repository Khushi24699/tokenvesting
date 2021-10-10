const TToken = artifacts.require("./TToken.sol");

module.exports = (deployer) => {
    deployer.deploy(TToken, "TToken", "TT", 18, 100000000);
};