const { ethers } = require('hardhat');
const { expect } = require('chai');
const { time } = require('@nomicfoundation/hardhat-network-helpers');
const BN = require('bn.js');
const sleep = require('util').promisify(require('timers').setTimeout);
const utils = require('../../anonymous.js/src/utils/utils');
const bn128 = require('../../anonymous.js/src/utils/bn128');
const Service = require('../../anonymous.js/src/utils/service');
const { ElGamal } = require('../../anonymous.js/src/utils/algebra.js');

const EPOCH_LENGTH = process.env.EPOCH_LENGTH || 6;

describe('ZSC', () => {
  let alice, bob, carol, dave, miner;
  let aliceShielded, bobShielded, carolShielded, daveShielded, minerShielded;
  let deployer;
  let cash, zsc;

  before(async () => {
    const accounts = await ethers.getSigners();
    deployer = accounts[0];
    alice = accounts[1];
    bob = accounts[2];
    carol = accounts[3];
    dave = accounts[4];
    miner = accounts[5];

    cash = await ethers.deployContract('CashToken');
    console.log('CashToken deployed to:', cash.address);

    const ipv = await ethers.deployContract('InnerProductVerifier');

    const ZetherVerifier = await ethers.getContractFactory('ZetherVerifier');
    const zv = await ZetherVerifier.deploy(ipv.address);

    const BurnVerifier = await ethers.getContractFactory('BurnVerifier');
    const bv = await BurnVerifier.deploy(ipv.address);

    const ZSC = await ethers.getContractFactory('ZSC');
    zsc = await ZSC.deploy(cash.address, zv.address, bv.address, EPOCH_LENGTH);
    await zsc.deployed();
    console.log('ZSC deployed to:      ', zsc.address);
  });

  it('should allow minting and approving', async () => {
    await cash.mint(alice.address, 1000);
    await cash.connect(alice).approve(zsc.address, 1000);
    const balance = await cash.balanceOf(alice.address);
    expect(balance).to.equal(1000, 'Minting failed');
  });

  it('should allow account registration', async () => {
    aliceShielded = utils.createAccount();
    const [c, s] = utils.sign(zsc.address, aliceShielded);
    await zsc.connect(deployer).register(bn128.serialize(aliceShielded['y']), c, s, { gasLimit: 6721975 });
  });

  it('should allow funding', async () => {
    await zsc.connect(alice).fund(bn128.serialize(aliceShielded['y']), 100, { gasLimit: 6721975 });
  });

  it('should allow transferring (2 decoys and no miner)', async () => {
    bobShielded = utils.createAccount();
    const [c1, s1] = utils.sign(zsc.address, bobShielded);
    await zsc.connect(deployer).register(bn128.serialize(bobShielded['y']), c1, s1, { gasLimit: 6721975 });

    carolShielded = utils.createAccount();
    const [c2, s2] = utils.sign(zsc.address, carolShielded);
    await zsc.connect(deployer).register(bn128.serialize(carolShielded['y']), c2, s2, { gasLimit: 6721975 });

    daveShielded = utils.createAccount();
    const [c3, s3] = utils.sign(zsc.address, daveShielded);
    await zsc.connect(deployer).register(bn128.serialize(daveShielded['y']), c3, s3, { gasLimit: 6721975 });

    minerShielded = utils.createAccount();
    const [c4, s4] = utils.sign(zsc.address, minerShielded);
    await zsc.connect(deployer).register(bn128.serialize(minerShielded['y']), c4, s4, { gasLimit: 6721975 });

    await alignBlocktime();

    let wait = timeBeforeNextEpoch() * 1000;
    console.log('Waiting until the next epoch (ms):', wait);
    await sleep(wait);
    const parties = [aliceShielded['y'], bobShielded['y'], carolShielded['y'], daveShielded['y']];
    const result = await zsc.simulateAccounts(parties.map(bn128.serialize), getEpoch());
    console.log('Retrieved encrypted balance: ', result);

    const currentBalance = 100;
    const value = 10;

    const deserialized = result.map((account) => ElGamal.deserialize(account));
    const r = bn128.randomScalar();
    const D = bn128.curve.g.mul(r);
    const C = parties.map((party, i) => {
      // index 0 is the sender, index 1 is the receiver, we don't test shuffling here
      const left = ElGamal.base['g'].mul(new BN(i === 0 ? -value : i === 1 ? value : 0)).add(party.mul(r));
      return new ElGamal(left, D);
    });
    const Cn = deserialized.map((account, i) => account.add(C[i]));
    const epoch = getEpoch();
    console.log('Proof epoch (used by the prover):', epoch);
    const proof = Service.proveTransfer(Cn, C, parties, epoch, aliceShielded['x'], r, value, currentBalance - value, [0, 1], 0);
    const u = utils.u(epoch, aliceShielded['x']);

    const accounts = await ethers.getSigners();
    const oneTimeAccount = accounts[6];
    await zsc.connect(oneTimeAccount).transfer(
      C.map((ciphertext) => bn128.serialize(ciphertext.left())),
      bn128.serialize(D),
      parties.map(bn128.serialize),
      bn128.serialize(u),
      proof.serialize(),
      bn128.serialize(minerShielded['y']),
      { gasLimit: 7721975, nonce: 0 }
    );
  });

  it('should allow withdrawing', async () => {
    await alignBlocktime();

    let wait = timeBeforeNextEpoch() * 1000;
    console.log('Waiting until the next epoch (ms):', wait);
    await sleep(wait);
    const result = await zsc.simulateAccounts([bn128.serialize(aliceShielded['y'])], getEpoch());
    console.log('Retrieved encrypted balance: ', result);

    const currentBalance = 90;
    const withdraw = 10;

    const deserialized = ElGamal.deserialize(result[0]);
    const C = deserialized.plus(new BN(-withdraw));
    const epoch = getEpoch();
    console.log('Proof epoch (used by the prover):', epoch);
    const proof = Service.proveBurn(C, aliceShielded['y'], epoch, alice.address, aliceShielded['x'], currentBalance - withdraw);
    const u = utils.u(epoch, aliceShielded['x']);
    await zsc.connect(alice).burn(bn128.serialize(aliceShielded['y']), withdraw, bn128.serialize(u), proof.serialize(), { gasLimit: 6721975 });
  });
});

function timeBeforeNextEpoch() {
  const current = new Date().getTime() / 1000;
  return Math.ceil(current / EPOCH_LENGTH) * EPOCH_LENGTH - current;
}

function getEpoch() {
  return Math.floor(new Date().getTime() / 1000 / EPOCH_LENGTH);
}

// for some reason, hardhat blocks tend to be in the future. this interferes
// with the epoch calculation alignment between the contract and the prover.
// we need to first catch up to the timestamp of the last block, then set an
// appropriate block time for the next block
async function alignBlocktime() {
  // first, we check if the latest block timestamp is in the future, and if so
  // wait until our wall clock catches up
  const latestBlocktime = await time.latest();
  const currentTime = new Date().getTime();
  if (latestBlocktime * 1000 > currentTime) {
    const wait = (latestBlocktime + 1) * 1000 - currentTime;
    console.log(`The block timestamp is ahead of the wall clock, waiting ${wait} ms to align`);
    await sleep(wait);
  }

  // next, we set the next block's timestamp to be the sum of:
  // 1. the remainder of the current epoch, because we want to download the balance, for which we wait for the next epoch
  // 2. the epoch length, to give ourselves enough time to go through the transaction preparation
  const remainder = Math.floor(timeBeforeNextEpoch());
  const nextBlocktime = latestBlocktime + EPOCH_LENGTH + remainder;
  console.log(`Setting the next block timestamp to 6 seconds in the future: ${nextBlocktime}`);
  await time.setNextBlockTimestamp(nextBlocktime);
}
