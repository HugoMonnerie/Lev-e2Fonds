const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const {address} = require("hardhat/internal/core/config/config-validation");

describe("KawaiiToken", function () {
    async function deployKawaiiToken() {
        const [ owner ] = await ethers.getSigners();

        const KawaiiToken = await ethers.getContractFactory("KawaiiToken");
        const kawaiiToken = await KawaiiToken.deploy();
        return { kawaiiToken, owner };
    }

    it("should have correct name, symbol", async function () {
        const { kawaiiToken, owner } = await loadFixture(deployKawaiiToken);

        expect(await kawaiiToken.name()).to.equal("KawaiiToken");
        expect(await kawaiiToken.symbol()).to.equal("UWU");
        expect(await kawaiiToken.balanceOf(owner.address)).to.equal(await kawaiiToken.MAX_SUPPLY());
    });
});
