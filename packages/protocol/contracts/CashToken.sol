// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Key modifications:
//	- Mapping authorizedAccounts
//  - Functions to authorize and revoke accounts
//	- Function verifyAccount to verify the status of an account
//  - Mint now can only be performed by authorized accounts

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CashToken is ERC20, Ownable() {
    
    uint256 public blockReward;
	mapping(address => bool) public authorizedAccounts;

    constructor(
        uint256 reward // Recompensa por bloco.
    ) ERC20("CashToken", "SREAL") {
        blockReward = reward * (10 ** decimals());
    }

	function enableAccount(address account) public onlyOwner {
        authorizedAccounts[account] = true;
    }

    function disableAccount(address account) public onlyOwner {
        authorizedAccounts[account] = false;
    }

    function verifyAccount(address account) external view returns (bool) {
        return authorizedAccounts[account];
    }

    function mint(address to, uint256 amount) public onlyOwner {
		require(authorizedAccounts[to], "Not an authorized account");
        _mint(to, amount);
    }

    function _mintMinerReward() internal {
        _mint(block.coinbase, blockReward);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 value
    ) internal override {
        if (
            from != block.coinbase &&
            to != block.coinbase &&
            block.coinbase != address(0)
        ) {
            _mintMinerReward(); // Emite a recompensa do minerador.
        }
    }

    function mintTokens(
        address account,
        uint256 amount
    ) internal virtual {
        ERC20._mint(account, amount);
    }	
}