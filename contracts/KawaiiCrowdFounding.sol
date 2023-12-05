// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "./KawaiiToken.sol";

contract KawaiiCrowdFounding is Ownable {
    KawaiiToken public kawaiiToken;

    constructor(address kawaiiTokenAddress) Ownable(msg.sender) {
        kawaiiToken = KawaiiToken(kawaiiTokenAddress);
    }

    // Fonction permettant l'achat de tokens en échange d'Ether
    function acheterTokens(address acheteur) public payable {
        require(msg.value > 0, "Le montant envoye doit etre superieur a zero");

        require(msg.value <= kawaiiToken.balanceOf(address(this)), "La levee de fonds est terminee"); 

        kawaiiToken.transfer(acheteur, msg.value);
    }

    // Fonction permettant au propriétaire de récupérer les tokens invendus après la fin de la levée de fonds
    function recupererTokensInvendus() public onlyOwner {
        uint256 tokensInvendus = kawaiiToken.balanceOf(address(this));
        require(tokensInvendus > 0, "Aucun token invendu a recuperer");

        kawaiiToken.transfer(owner(), tokensInvendus);
    }

    // Fonction permettant au propriétaire de récupérer les Ethers collectés post levée de fonds
    function recupererEthers() public onlyOwner {
        uint256 soldeContract = address(this).balance;
        console.log("ether :", soldeContract);
        require(soldeContract > 0, "Aucun Ether a recuperer");

        bool sent = payable(owner()).send(soldeContract);
        require(sent, "Failed to send Ether");
    }
}
