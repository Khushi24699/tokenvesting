const now = Math.floor(Date.now() / 1000);
const day = 24 * 60 * 60;

const beneficiaries = [{
        address: "0xCaDc4F9Ed5946A25cDAe2151D7d56f9e1436bb2c",
        shares: 15,
    },

    {
        address: "0xA46f8C2E7298474990c9D98F474C2284a0Fd4B6F",
        shares: 20,
    },
    {
        address: "0x90264871734ae43819874EBCc1C0f1E5CD501BF",
        shares: 20,
    },
    {
        address: "0x91489a6542e8e111c29EFf91d4951E4F4caBEB0d",
        shares: 20,
    },
    {
        address: "0x1fAb116911E872f3287e8AAf26D855af49B65dA4",
        shares: 20,
    },



];

const tokenSettings = {
    name: "TToken",
    symbol: "TT",
    decimals: 18,
    amount: 100000000,
};

const vestingSettings = {
    start: now + day,

    duration: 3 * 365 * day,
};




const TToken = artifacts.require("./token.sol");
const TokenVesting = artifacts.require("./TokenVesting.sol");

module.exports = (deployer, network, [owner]) => deployer
    .then(() => deployToken(deployer))
    .then(() => deployTokenVestingContract(deployer))
    .then(() => transferTokensToVestingContract(owner))
    .then(() => addBeneficiariesToVestingContract(owner));



function deployToken(deployer) {
    return deployer.deploy(
        TToken,
        tokenSettings.name,
        tokenSettings.symbol,
        tokenSettings.decimals,
        tokenSettings.amount,
    );
}

function deployTokenVestingContract(deployer) {
    return deployer.deploy(
        TokenVesting,
        TToken.address,
        vestingSettings.start,

        vestingSettings.duration,
    );
}



async function transferTokensToVestingContract(owner) {
    const sharesSum = beneficiaries.reduce((sharesSum, beneficiary) => sharesSum + beneficiary.shares, 0);
    return (await TToken.deployed()).transfer(
        TokenVesting.address,
        calculateNumberOfTokensForSharesPercentage(sharesSum),
    );
}

function calculateNumberOfTokensForSharesPercentage(shares) {
    return tokenSettings.amount * shares / 100;
}

async function addBeneficiariesToVestingContract(owner) {
    return Promise.all(
        beneficiaries.map(async(beneficiary) => {
            (await TokenVesting.deployed()).addBeneficiary(
                beneficiary.address,
                beneficiary.shares,
            );
        }),
    );
}