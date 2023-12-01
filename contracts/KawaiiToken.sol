// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract KawaiiToken is ERC20 {
    uint256 public constant MAX_SUPPLY = 1000000 * 10**18; // Maximum supply of 1 million tokens

    constructor() ERC20("KawaiiToken", "UWU") {
        _mint(msg.sender, MAX_SUPPLY);
    }
}
