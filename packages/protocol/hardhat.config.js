require('hardhat/config');
require('@nomicfoundation/hardhat-toolbox');
require('solidity-docgen');
//require('hardhat-gas-reporter');

const loggingMiddleware = require('./loggingMiddleware');

const config = {
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
      hardfork: 'berlin', // berlin is needed to support minGasPrice = 0
      minGasPrice: 0,  //this is needed to not having to own ETH in admin and user accounts (see base.js)
      initialDate: new Date().toString(),
    },
    localTest: {
      url: 'http://127.0.0.1:8545/',
      gasPrice: 0,
      accounts: [
        '950e0c1d6d719c65104bdeed2bd1ff97781cf90f1334abfe80e140ded4c40d21',
        'c58d50a7bafded88160e3be08c69fcbc5103db6a331a99558283395a03247a84',
        'e2dd3ba529d902ce0638c4cdc48a4b1c13760a0ebb52fdce71bc37c5a1dbe317',
        '5fa6326ce5218aeed32e921f3a16b9f5b0b5c19a2c28e8ed8f7ff33e803059b3',
        'c4a8d38d75700f54b66bd463bed973a1800b93d998dc3ec9fcd4785e63e39c71',
        'd3668c2902556671f321d680faf681fd151ef127893aee812591eb168e0eab2b',
      ],
    },
  },
  docgen: { pages: 'files' },
  /*gasReporter: {
	  enabled: true,
	  outputFile: "gas-report.txt",
	  noColors: true,
  }*/
};

module.exports = config;
