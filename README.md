# Anonymous Zether

**This project was forked from [Kaleido's anonymous-zether](http://github.com/kaleido/anonymous-zether) with the main objective of implementing Delivery vs Payment transactions with privacy using Anonymous Zether. This README document is based on the original, but was updated to include the modifications made on the application.**

This is a private payment system, an _anonymous_ extension of Bünz, Agrawal, Zamani and Boneh's [Zether protocol](https://eprint.iacr.org/2019/191.pdf).

The authors sketch an anonymous extension in their original manuscript. We develop an explicit proof protocol for this extension, described in the technical paper [AnonZether.pdf](docs/AnonZether.pdf). We also fully implement this anonymous protocol (including verification contracts and a client / front-end with its own proof generator). 
> To interact with this version of Anonymous Zether, use the [anonymous-zether-client](https://github.com/dalmendra/anonymous-zether-client) application.

## High-level overview

Anonymous Zether is an private value-tracking system, in which an Ethereum smart contract maintains encrypted account balances. Each Zether Smart Contract (ZSC) must, upon deployment, "attach" to some already-deployed ERC-20 contract; once deployed, this contract establishes special "Zether" accounts into / out of which users may _deposit_ or _withdraw_ ERC-20 funds. Having credited funds to a Zether account, its owner may privately send these funds to other Zether accounts, _confidentially_ (transferred amounts are private) and _anonymously_ (identities of transactors are private). Only the owner of each account's secret key may spend its funds, and overdraws are impossible.

To enhance their privacy, users should conduct as much business as possible within the ZSC.

The (anonymous) Zether Smart Contract operates roughly as follows (see the [original Zether paper](https://eprint.iacr.org/2019/191.pdf) for more details). Each account consists of an ElGamal ciphertext, which encrypts the account's balance under its own public key. To send funds, Alice publishes an ordered list of public keys—which contains herself and the recipient, among other arbitrarily chosen parties—together with a corresponding list of ElGamal ciphertexts, which respectively encrypt (under the appropriate public keys) the amounts by which Alice intends to adjust these various accounts' balances. The ZSC applies these adjustments using the homomomorphic property of ElGamal encryption (with "message in the exponent"). Alice finally publishes a zero-knowledge proof which asserts that she knows her own secret key, that she owns enough to cover her deduction, that she deducted funds only from herself, and credited them only to Bob (and by the same amount she debited, no less); she of course also demonstrates that she did not alter those balances other than her own and Bob's. These adjustment ciphertexts—opaque to any outside observer—conceal who sent funds to whom, and how much was sent.

Users need _never_ interact directly with the ZSC; rather, our front-end [anonymous-zether-client](https://github.com/dalmendra/anonymous-zether-client) streamlines its use.

Our theoretical contribution is a zero-knowledge proof protocol for the anonymous transfer statement (8) of [Bünz, et al.](https://eprint.iacr.org/2019/191.pdf), which moreover has appealing asymptotic performance characteristics; details on our techniques can be found in our [paper](docs/AnonZether.pdf). We also of course provide this implementation.

## Prerequisites

Anonymous Zether can be deployed and tested easily using [Truffle](https://www.trufflesuite.com/truffle) and [Ganache](https://www.trufflesuite.com/ganache). This version also supports [Hardhat](https://github.com/NomicFoundation/hardhat) to run a local Ethereum node.

### Required utilities
* [Yarn](https://yarnpkg.com/en/docs/install#mac-stable), tested with version v1.22.19.
* [Node.js](https://nodejs.org/en/download/), tested with version v16.15.1.
* [Hardhat Network](https://github.com/NomicFoundation/hardhat) - tested with version v2.22.12.

## Installing Anonymous Zether

Navigate to the [protocol](./packages/protocol) directory.

Run the following commands:
```bash
npm install
npm install hardhat
npm install -g truffle
npm install -g ganache (if not using hardhat)
```
>Note: last tested with truffle v5.5.27, hardhat 2.22.12, and ganache v7.3.2.

## Running Tests

Now, in one window, type
```bash
ganache-cli --gasPrice 0 -k berlin
```
**Note:** the `-k berlin` fork is required due to an externally signed transaction (by a random account with no balance) which is part of the transfer flow. The london fork introduces minimum pricing for gas. 

In a second window, type
```bash
truffle test
```
This command should compile and deploy all necessary contracts, as well as run some example code. You can see this example code in the test file [zsc.js](./packages/protocol/test/zsc.js).

## Anonymous Zether Usage

### Compile the Anonymous Zether contracts]

Example (using hardhat):

```bash
npx hardhat compile
```

### Deploy Anonymous Zether Contracts

First make sure the smart contracts are deployed properly. To make Anonymous Zether work and allow for private DvP transactions using an ERC-1155 and an ERC-20 tokens, you need to deploy these tokens contracts as well as the Anonymous Zether contracts for each of them.

The easiest way to deploy is using the Hardhat script in the [protocol](`./packages/protocol`) folder:

```console
$ cd anonymous-zether/packages/protocol
$ npm run deploy:local

> @anonymous-zether/protocol@0.1.0 deploy:local
> npx hardhat run scripts/deploy.js --network localTest

Deploying contracts with the account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Deployer private key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
CashToken contract deployed to  0x5FbDB2315678afecb367f032d93F642f64180aa3
CashToken owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
ERC1155Token contract deployed to  0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
ERC1155Token owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
InnerProductVerifier deployed to  0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
ZetherVerifier deployed to  0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
BurnVerifier deployed to  0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
ZSCRestricted deployed to  0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
ZSCERC1155Restricted deployed to  0x0165878A594ca255338adfa4d48449f69242Eb8F
DvpZSC deployed to  0xa513E6E4b8f2a923D98304ec87F64353C4D5C853
```

> Note: to allow enough time for the DvP transactions to be executed, the epoch length may need to be increased. To perform that change, edit the script `packages/protocol/scripts/deploy.js` and change the line `const EPOCH_LENGTH = process.env.EPOCH_LENGTH || 6;` to 60 seconds or more, up to 240 seconds. The epoch must also be changed accordingly in the `.env` file (`ZSC_EPOCH_LENGTH` parameter) in [anonymous-zether-client](https://github.com/dalmendra/anonymous-zether-client).

### Detailed usage an interaction:
Please refer to [anonymous-zether-client](https://github.com/dalmendra/anonymous-zether-client) to see all transactions that can be performed using that client front-end, including the DvP transaction.
