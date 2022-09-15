// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

const { ethers } = require("hardhat");
const path = require("path");
const web3 = require("@nomiclabs/hardhat-web3");


const _getTimeStamp = async () => {
  const blockNum = await ethers.provider.getBlockNumber();
  const block = await ethers.provider.getBlock(blockNum);
  const timestamp = block.timestamp;
  return timestamp;

}
const _createWeightObject = (
  maxWeightShares,
  minWeightShares,
  maxWeightPenalty,
  minWeightPenalty,
  weightMultiplier) => {
  return {
    maxWeightShares: maxWeightShares,
    minWeightShares: minWeightShares,
    maxWeightPenalty: maxWeightPenalty,
    minWeightPenalty: minWeightPenalty,
    penaltyWeightMultiplier: weightMultiplier
  }
}

async function main() {
  const sumToApprove =ethers.utils.parseEther("2000")
  const oneMonth = 30 * 24 * 60 * 60;
    const oneYear = 31556926;

  const maxWeightShares = 1024;
  const minWeightShares = 256;
  const maxWeightPenalty = 3000;
  const minWeightPenalty = 100;
  const weightMultiplier = 10;
  const maxNumberOfLocks = 10;
  const _flags = 0;

  const weightObject = _createWeightObject(
    maxWeightShares,
    minWeightShares,
    maxWeightPenalty,
    minWeightPenalty,
    weightMultiplier)

   //this is used for stream shares calculation.
   const veMainTokenCoefficient = 500;
   //this is used for calculation of release of veMAINTkn
   const lockingVoteWeight = oneYear;
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
      "gets automatically created and destroyed every time. Use the Hardhat" +
      " option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const [...accounts] = await ethers.getSigners();
  const SYSTEM_ACC = accounts[0]
  console.log(
    "Deploying the contracts with the account:",
    await SYSTEM_ACC.getAddress()
  );

  console.log("Account balance:", (await SYSTEM_ACC.getBalance()).toString());

  const Staking = await ethers.getContractFactory("StakingPackage");
  const staking = await Staking.deploy();
  await staking.deployed();
  const Vault = await ethers.getContractFactory("VaultPackage")
  const vault = await Vault.deploy();
  await vault.deployed();
  
  const vault_test_address = vault.address;

  const MainToken = await ethers.getContractFactory("ERC20MainToken");
 // ethers.utils.parseUnits(1000000.toString(), "ether")
  const mainToken = await MainToken.deploy("Main Token", "R1T", ethers.utils.parseEther("1000000"), accounts[1].address)
  await mainToken.deployed()
  const VeMainToken = await ethers.getContractFactory("VeMainToken");
  const veMainToken = await VeMainToken.deploy();
  await veMainToken.deployed();

  await veMainToken.addToWhitelist(staking.address, {from: SYSTEM_ACC.address})
  
  const mainTknTokenAddress =  mainToken.address;
  await vault.addSupportedToken(mainTknTokenAddress)
  const veMainTokenAddress = veMainToken.address;
   const stream_owner = SYSTEM_ACC.address;

  const minter_role = await veMainToken.MINTER_ROLE();
  
  await veMainToken.grantRole(minter_role, staking.address, { from: SYSTEM_ACC.address });
  const startTime = await _getTimeStamp() + 20;
  const scheduleRewards = [
    ethers.utils.parseEther("2000"),
    ethers.utils.parseEther("1000"),
    ethers.utils.parseEther("500"),
    ethers.utils.parseEther("250"),
    ethers.utils.parseEther("0")
  ]
  const scheduleTimes = [
    startTime,
    startTime + oneYear,
    startTime + 2 * oneYear,
    startTime + 3 * oneYear,
    startTime + 4 * oneYear,
  ]

  console.log("hereh1")

  // console.log(vault_test_address)
  // console.log(mainTknTokenAddress)
  // console.log(veMainTokenAddress)
  // console.log(weightObject)
  // console.log(stream_owner)
  // console.log(scheduleTimes)
  // console.log(scheduleRewards)
  // console.log(veMainTokenCoefficient,
  //   lockingVoteWeight,
  //   maxNumberOfLocks)

  await staking.initializeStaking(
    vault_test_address,
    mainTknTokenAddress,
    veMainTokenAddress,
    weightObject,
    stream_owner,
    scheduleTimes,
    scheduleRewards,
    2,
    veMainTokenCoefficient,
    lockingVoteWeight,
    maxNumberOfLocks
  )


  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(staking, mainToken, veMainToken);

  
}

function saveFrontendFiles(staking, mainToken, veMainToken) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "client", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ Staking: staking.address, MainToken: mainToken.address, VeMainToken: veMainToken.address }, undefined, 2),
  );

  console.log({ Staking: staking.address, MainToken: mainToken.address, VeMainToken: veMainToken.address })


  const StakingArtifact = artifacts.readArtifactSync("StakingPackage");
  const MainTokenArtifact = artifacts.readArtifactSync("ERC20MainToken");
  const VeMainTokenArtifact = artifacts.readArtifactSync("VeMainToken");



  fs.writeFileSync(
    path.join(contractsDir, "Staking.json"),
    JSON.stringify(StakingArtifact, null, 2)
  );

  fs.writeFileSync(
    path.join(contractsDir, "MainToken.json"),
    JSON.stringify(MainTokenArtifact, null, 2)
  );

  fs.writeFileSync(
    path.join(contractsDir, "VeMainToken.json"),
    JSON.stringify(VeMainTokenArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
