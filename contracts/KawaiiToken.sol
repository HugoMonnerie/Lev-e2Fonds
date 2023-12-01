// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {KawaiiCrowdFounding} from "./KawaiiCrowdFounding.sol";

contract KawaiiToken is ERC20, Ownable, KawaiiCrowdFounding {
    uint256 public constant MAX_SUPPLY = 1000000 * 10**18; // Maximum supply of 1 million tokens

    constructor() ERC20("KawaiiToken", "UWU") Ownable(msg.sender) {
        //_mint(msg.sender, MAX_SUPPLY);
        transferAllTokens(address(this));
    }
}
