// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract KawaiiToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1000000 * 10**18; // Maximum supply of 1 million tokens

    constructor(address initialOwner) ERC20("KawaiiToken", "UWU") Ownable(initialOwner) {
        _mint(msg.sender, MAX_SUPPLY);
    }

    // Fonction permettant l'achat de tokens en échange d'Ether
    function acheterTokens(uint256 montant) external payable {
        require(msg.value > 0, "Le montant envoye doit etre superieur a zero");
        require(totalSupply() + montant <= MAX_SUPPLY, "La levee de fonds est terminee");

        _mint(msg.sender, montant);
    }

    // Fonction permettant au propriétaire de récupérer les tokens invendus après la fin de la levée de fonds
    function recupererTokensInvendus() external onlyOwner {
        uint256 tokensInvendus = balanceOf(address(this));
        require(tokensInvendus > 0, "Aucun token invendu a recuperer");

        _transfer(address(this), owner(), tokensInvendus);
    }

    // Fonction permettant au propriétaire de récupérer les Ethers collectés post levée de fonds
    function recupererEthers() external onlyOwner {
        uint256 soldeContract = address(this).balance;
        require(soldeContract > 0, "Aucun Ether a recuperer");

        payable(owner()).transfer(soldeContract);
    }
}
