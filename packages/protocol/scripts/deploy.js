'use strict';

const { ethers } = require('hardhat');

const EPOCH_LENGTH = process.env.EPOCH_LENGTH || 6;

async function main() {
  const [deployer] = await ethers.getSigners();

  const ContractFactory = await ethers.getContractFactory('CashToken');
  const cashToken = await ContractFactory.deploy();
  await cashToken.deployed();
  console.log('CashToken contract deployed to ', cashToken.address);

  const InnerProductVerifier = await ethers.getContractFactory('InnerProductVerifier');
  const instanceProductVerifier = await InnerProductVerifier.deploy();
  await instanceProductVerifier.deployed();
  console.log('InnerProductVerifier deployed to ', instanceProductVerifier.address);

  const ZetherVerifier = await ethers.getContractFactory('ZetherVerifier');
  const instanceZetherVerifier = await ZetherVerifier.deploy(instanceProductVerifier.address);
  await instanceZetherVerifier.deployed();
  console.log('ZetherVerifier deployed to ', instanceZetherVerifier.address);

  const BurnVerifier = await ethers.getContractFactory('BurnVerifier');
  const instanceBurnVerifier = await BurnVerifier.deploy(instanceProductVerifier.address);
  await instanceBurnVerifier.deployed();
  console.log('BurnVerifier deployed to ', instanceBurnVerifier.address);

  const ZSC = await ethers.getContractFactory('ZSC');
  const instanceZSC = await ZSC.deploy(cashToken.address, instanceZetherVerifier.address, instanceBurnVerifier.address, EPOCH_LENGTH);
  await instanceZSC.deployed();
  console.log('ZSC deployed to ', instanceZSC.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
