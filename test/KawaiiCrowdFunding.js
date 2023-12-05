const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { address } = require("hardhat/internal/core/config/config-validation");

describe("KawaiiCrowdFunding", function () {
    async function deployKawaiiCrowdFunding() {
        const [owner, otherAccount] = await ethers.getSigners();

        const KawaiiToken = await ethers.getContractFactory("KawaiiToken");
        const kawaiiToken = await KawaiiToken.deploy();

        const KawaiiCrowdFunding = await ethers.getContractFactory("KawaiiCrowdFunding");
        const kawaiiCrowdFunding = await KawaiiCrowdFunding.deploy(await kawaiiToken.getAddress());

        await kawaiiToken.transfer(await kawaiiCrowdFunding.getAddress(), 1000);

        return { kawaiiCrowdFunding, kawaiiToken, owner, otherAccount };
    }
    async function deployEmptyKawaiiCrowdFunding() {
        const [owner, otherAccount] = await ethers.getSigners();

        const KawaiiToken = await ethers.getContractFactory("KawaiiToken");
        const kawaiiToken = await KawaiiToken.deploy();

        const KawaiiCrowdFunding = await ethers.getContractFactory("KawaiiCrowdFunding");
        const kawaiiCrowdFunding = await KawaiiCrowdFunding.deploy(await kawaiiToken.getAddress());

        return { kawaiiCrowdFunding, kawaiiToken, owner, otherAccount };
    }

    it("should allow buying tokens", async function () {
        const { kawaiiCrowdFunding, kawaiiToken, otherAccount } = await loadFixture(deployKawaiiCrowdFunding);

        const amount = 100;

        await kawaiiCrowdFunding.purchaseTokens(await otherAccount.getAddress(), { value: amount });

        expect(await kawaiiToken.balanceOf(await otherAccount.getAddress())).to.equal(amount);
    });

    it("should allow owner to recover unsold tokens", async function () {
        const { kawaiiCrowdFunding, kawaiiToken, owner } = await loadFixture(deployEmptyKawaiiCrowdFunding);

        const unsoldTokens = BigInt(500);

        //Ajout des token invendu
        await kawaiiToken.transfer(await kawaiiCrowdFunding.getAddress(), unsoldTokens);

        const initialBalance = await kawaiiToken.balanceOf(await owner.getAddress());

        await kawaiiCrowdFunding.retrieveUnsoldTokens();

        expect(await kawaiiToken.balanceOf(owner.getAddress())).to.equal(initialBalance + unsoldTokens);
    });

    it("should allow owner to recover ethers", async function () {
        const { kawaiiCrowdFunding, owner, otherAccount } = await loadFixture(deployKawaiiCrowdFunding);

        await kawaiiCrowdFunding.purchaseTokens(await otherAccount.getAddress(), { value: 100 });

        const initialBalance = await ethers.provider.getBalance(owner.getAddress());
        const contractBalance = await ethers.provider.getBalance(kawaiiCrowdFunding.getAddress());

        await kawaiiCrowdFunding.retrieveEth();

        const finalBalance = await ethers.provider.getBalance(owner.getAddress());

        console.log("initialBalance :", initialBalance);
        console.log("contractBalance :", contractBalance);
        console.log("finalBalance :", finalBalance);
        console.log("differance final and init :", finalBalance - initialBalance);

        expect(finalBalance - initialBalance).to.equal(contractBalance);
    });
});
