const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const {address} = require("hardhat/internal/core/config/config-validation");

describe("KawaiiCrowdFounding", function () {
    async function deployKawaiiCrowdFounding() {
        const [ owner, otherAccount ] = await ethers.getSigners();

        const KawaiiToken = await ethers.getContractFactory("KawaiiToken");
        const kawaiiToken = await KawaiiToken.deploy();

        const KawaiiCrowdFounding = await ethers.getContractFactory("KawaiiCrowdFounding");
        const kawaiiCrowdFounding = await KawaiiCrowdFounding.deploy(await kawaiiToken.getAddress());

        await kawaiiToken.transfer(await kawaiiCrowdFounding.getAddress(), 1000);

        return { kawaiiCrowdFounding, kawaiiToken, owner, otherAccount };
    }
    async function deployEmptyKawaiiCrowdFounding() {
        const [ owner, otherAccount ] = await ethers.getSigners();

        const KawaiiToken = await ethers.getContractFactory("KawaiiToken");
        const kawaiiToken = await KawaiiToken.deploy();

        const KawaiiCrowdFounding = await ethers.getContractFactory("KawaiiCrowdFounding");
        const kawaiiCrowdFounding = await KawaiiCrowdFounding.deploy(await kawaiiToken.getAddress());

        return { kawaiiCrowdFounding, kawaiiToken, owner, otherAccount };
    }

    it("should allow buying tokens", async function () {
        const { kawaiiCrowdFounding, kawaiiToken, otherAccount } = await loadFixture(deployKawaiiCrowdFounding);

        const amount = 100;

        await kawaiiCrowdFounding.acheterTokens(await otherAccount.getAddress(), { value: amount });

        expect(await kawaiiToken.balanceOf(await otherAccount.getAddress())).to.equal(amount);
    });

    it("should allow owner to recover unsold tokens", async function () {
        const { kawaiiCrowdFounding, kawaiiToken, owner } = await loadFixture(deployEmptyKawaiiCrowdFounding);

        const unsoldTokens = BigInt(500);

        //Ajout des token invendu
        await kawaiiToken.transfer(await kawaiiCrowdFounding.getAddress(), unsoldTokens);

        const initialBalance = await kawaiiToken.balanceOf(await owner.getAddress());

        await kawaiiCrowdFounding.recupererTokensInvendus();

        expect(await kawaiiToken.balanceOf(owner.getAddress())).to.equal(initialBalance + unsoldTokens);
    });

    it("should allow owner to recover ethers", async function () {
        const { kawaiiCrowdFounding, owner, otherAccount } = await loadFixture(deployKawaiiCrowdFounding);

        await kawaiiCrowdFounding.acheterTokens(await otherAccount.getAddress(), { value: 100 });

        const initialBalance = await ethers.provider.getBalance(owner.getAddress());
        const contractBalance = await ethers.provider.getBalance(kawaiiCrowdFounding.getAddress());

        await kawaiiCrowdFounding.recupererEthers();

        const finalBalance = await ethers.provider.getBalance(owner.getAddress());

        console.log("initialBalance :", initialBalance);
        console.log("contractBalance :", contractBalance);
        console.log("finalBalance :", finalBalance);
        console.log("differance final and init :", finalBalance - initialBalance);

        expect(finalBalance - initialBalance).to.equal(contractBalance);
    });
});
