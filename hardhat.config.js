require("@nomicfoundation/hardhat-toolbox");

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.13",
    settings: {
      optimizer: {
        enabled: true,
        details: { yul: false },
        runs: 200,
      },
    },
  },

  networks: {
    hardhat: {
      chainId: 1337,
      gas: 21000000, // We set 1337 to make interacting with MetaMask simpler
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
        passphrase: "",
      }

    },

    localhost: {
      chainId: 1337,
      gas: 21000000, // We set 1337 to make interacting with MetaMask simpler
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
        passphrase: "",
      }

    },
    
  },

};
