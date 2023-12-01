const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const {address} = require("hardhat/internal/core/config/config-validation");

describe("KawaiiCrowdFounding", function () {
    async function deployKawaiiCrowdFounding() {

        const KawaiiToken = await ethers.getContractFactory("KawaiiToken");
        const kawaiiToken = await KawaiiToken.deploy();

        const KawaiiCrowdFounding = await ethers.getContractFactory("KawaiiCrowdFounding");
        const kawaiiCrowdFounding = await KawaiiCrowdFounding.deploy(await kawaiiToken.getAddress());

        kawaiiToken.transfer(await kawaiiCrowdFounding.getAddress(), 1000);

        return { kawaiiCrowdFounding, kawaiiToken };
    }

    it("should allow buying tokens", async function () {
        const { kawaiiCrowdFounding, kawaiiToken } = await loadFixture(deployKawaiiCrowdFounding);

        const amount = 100;

        await kawaiiCrowdFounding.acheterTokens(amount, { value: amount });

        expect(await kawaiiCrowdFounding.balanceOf(msg.sender)).to.equal(amount);
    });

    it("should allow owner to recover unsold tokens", async function () {
        const { kawaiiCrowdFounding, kawaiiToken } = await loadFixture(deployKawaiiCrowdFounding);

        const unsoldTokens = 500;

        await kawaiiCrowdFounding.recupererTokensInvendus();

        expect(await kawaiiCrowdFounding.balanceOf(kawaiiToken.getAddress())).to.equal(unsoldTokens);
    });

    it("should allow owner to recover ethers", async function () {
        const { kawaiiCrowdFounding, kawaiiToken } = await loadFixture(deployKawaiiCrowdFounding);

        const initialBalance = await ethers.provider.getBalance(kawaiiToken.getAddress());
        const contractBalance = await ethers.provider.getBalance(kawaiiCrowdFounding.getAddress());

        console.log("initialBalance :", initialBalance);
        console.log("contractBalance :", contractBalance);

        await kawaiiCrowdFounding.recupererEthers();

        const finalBalance = await ethers.provider.getBalance(kawaiiToken.getAddress());

        expect(finalBalance.sub(initialBalance)).to.equal(contractBalance);
    });
});
