// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "hardhat/console.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "./KawaiiToken.sol";

contract KawaiiCrowdFounding is Ownable {
    KawaiiToken public kawiiToken;

    constructor(address kawaiiTokenAddress) Ownable(msg.sender) {
        kawiiToken = KawaiiToken(kawaiiTokenAddress);
    }

    // Fonction permettant l'achat de tokens en échange d'Ether
    function acheterTokens(uint256 montant) public payable {
        require(msg.value > 0, "Le montant envoye doit etre superieur a zero");
        console.log("kawiiToken.totalSupply()", kawiiToken.totalSupply());
        console.log("montant", montant);
        console.log("kawiiToken.balanceOf(address(this)", kawiiToken.balanceOf(address(this)));

        require(kawiiToken.totalSupply() + montant <= kawiiToken.balanceOf(address(this)), "La levee de fonds est terminee");

        kawiiToken.transfer(msg.sender, montant);
    }

    // Fonction permettant au propriétaire de récupérer les tokens invendus après la fin de la levée de fonds
    function recupererTokensInvendus() public onlyOwner {
        uint256 tokensInvendus = kawiiToken.balanceOf(address(this));
        require(tokensInvendus > 0, "Aucun token invendu a recuperer");

        kawiiToken.transfer(owner(), tokensInvendus);
    }

    // Fonction permettant au propriétaire de récupérer les Ethers collectés post levée de fonds
    function recupererEthers() public onlyOwner {
        uint256 soldeContract = address(this).balance;
        require(soldeContract > 0, "Aucun Ether a recuperer");

        payable(owner()).transfer(soldeContract);
    }
}
