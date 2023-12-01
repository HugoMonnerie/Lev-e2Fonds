const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("KawaiiToken", function () {
    async function deployKawaiiToken() {
        const [owner, addr1] = await ethers.getSigners();

        KawaiiToken = await ethers.getContractFactory("KawaiiToken");
        kawaiiToken = await KawaiiToken.deploy(owner);
        return { kawaiiToken, owner, addr1 };
    }

    it("should have correct name and symbol", async function () {
        const { kawaiiToken } = await loadFixture(deployKawaiiToken);

        expect(await kawaiiToken.name()).to.equal("KawaiiToken");
        expect(await kawaiiToken.symbol()).to.equal("UWU");
    });

    it("should allow buying tokens", async function () {
        const { kawaiiToken } = await loadFixture(deployKawaiiToken);

        const amount = 100;

        await kawaiiToken.acheterTokens(amount, { value: amount });

        expect(await kawaiiToken.balanceOf(owner.address)).to.equal(amount);
    });

    it("should allow owner to recover unsold tokens", async function () {
        const { kawaiiToken, owner } = await loadFixture(deployKawaiiToken);

        const unsoldTokens = 500;

        await kawaiiToken.recupererTokensInvendus();

        expect(await kawaiiToken.balanceOf(owner.address)).to.equal(unsoldTokens);
    });

    it("should allow owner to recover ethers", async function () {
        const { kawaiiToken, owner } = await loadFixture(deployKawaiiToken);

        const initialBalance = await ethers.provider.getBalance(owner.address);
        const contractBalance = await ethers.provider.getBalance(kawaiiToken.target);

        await kawaiiToken.recupererEthers();

        const finalBalance = await ethers.provider.getBalance(owner.address);

        expect(finalBalance.sub(initialBalance)).to.equal(contractBalance);
    });
});
