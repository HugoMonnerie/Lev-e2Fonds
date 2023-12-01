const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const {address} = require("hardhat/internal/core/config/config-validation");

describe("KawaiiToken", function () {
    async function deployKawaiiToken() {
        const KawaiiToken = await ethers.getContractFactory("KawaiiToken");
        const kawaiiToken = await KawaiiToken.deploy();
        return { kawaiiToken };
    }

    it("should have correct name, symbol and transfer token", async function () {
        const { kawaiiToken } = await loadFixture(deployKawaiiToken);

        expect(await kawaiiToken.name()).to.equal("KawaiiToken");
        expect(await kawaiiToken.symbol()).to.equal("UWU");
        expect(await kawaiiToken.balanceOf(kawaiiToken.target)).to.equal(0);
    });
});
