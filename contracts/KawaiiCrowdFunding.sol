// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "hardhat/console.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "./KawaiiToken.sol";

contract KawaiiCrowdFunding is Ownable {
    KawaiiToken public kawaiiToken;

    constructor(address kawaiiTokenAddress) Ownable(msg.sender) {
        kawaiiToken = KawaiiToken(kawaiiTokenAddress);
    }

    // Function allowing the purchase of tokens in exchange for Ether
    function purchaseTokens(address acheteur) public payable {
        require(msg.value > 0, "Le montant envoye doit etre superieur a zero");

        require(
            msg.value <= kawaiiToken.balanceOf(address(this)),
            "La levee de fonds est terminee"
        );

        kawaiiToken.transfer(acheteur, msg.value);
    }

    // Function allowing the owner to retrieve unsold tokens after the end of the crowdfunding
    function retrieveUnsoldTokens() public onlyOwner {
        uint256 tokensInvendus = kawaiiToken.balanceOf(address(this));
        require(tokensInvendus > 0, "Aucun token invendu a recuperer");

        kawaiiToken.transfer(owner(), tokensInvendus);
    }

    // Function allowing the owner to retrieve the Ethers collected post crowdfunding
    function retrieveEth() public onlyOwner {
        uint256 soldeContract = address(this).balance;
        console.log("ether :", soldeContract);
        require(soldeContract > 0, "Aucun Ether a recuperer");

        bool sent = payable(owner()).send(soldeContract);
        require(sent, "Failed to send Ether");
    }
}
