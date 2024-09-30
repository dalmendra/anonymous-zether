// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Key modifications:
//	- Mapping authorizedAccounts
//  - Functions to authorize and revoke accounts
//	- Function verifyAccount to verify the status of an account
//  - Mint now can only be performed by authorized accounts

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Erc1155Token is ERC1155, Ownable() {
    
    uint256 public constant MILES_ID = 0;
	mapping(address => bool) public authorizedAccounts;

    constructor() ERC1155("") {
    }

    function mint(address to, uint256 amount) public onlyOwner {
		require(authorizedAccounts[to], "Not an authorized account");
        _mint(to, MILES_ID, amount, "");
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
}