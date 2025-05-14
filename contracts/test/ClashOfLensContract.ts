import "@nomicfoundation/hardhat-chai-matchers";
import { expect } from "chai";
import hre from "hardhat";

describe("ClashOfLensContract", function () {
  let contract: any;
  let owner: any;
  let addr1: any;
  let addr2: any;
  let addr3: any;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await hre.ethers.getSigners();
    const ClashOfLens = await hre.ethers.getContractFactory(
      "ClashOfLensContract"
    );
    contract = await ClashOfLens.deploy(owner.address);
    await contract.deployed();
  });

  it("should deploy successfully", async function () {
    expect(contract.address).to.be.a("string");
  });

  it("should allow a user to register a clan", async function () {
    await expect(contract.connect(addr1).registerClan())
      .to.emit(contract, "ClanRegistered")
      .withArgs(addr1.address, addr1.address);
    const clanIndex = await contract.clanIndex(addr1.address);
    expect(clanIndex).to.equal(1);
  });

  it("should allow a clan to set ready with a stake", async function () {
    await contract.connect(addr1).registerClan();
    await expect(
      contract.connect(addr1).setReady({ value: hre.ethers.parseEther("1") })
    )
      .to.emit(contract, "ClanReady")
      .withArgs(addr1.address, hre.ethers.parseEther("1"));
  });

  it("should allow two clans to wage war", async function () {
    await contract.connect(addr1).registerClan();
    await contract.connect(addr2).registerClan();
    await contract
      .connect(addr1)
      .setReady({ value: hre.ethers.parseEther("1") });
    await contract
      .connect(addr2)
      .setReady({ value: hre.ethers.parseEther("1") });
    await expect(
      contract
        .connect(addr1)
        .wageWar(addr2.address, { value: hre.ethers.parseEther("1") })
    ).to.emit(contract, "WarDeclared");
    const war = await contract.wars(0);
    expect(war.clan1).to.equal(addr1.address);
    expect(war.clan2).to.equal(addr2.address);
  });

  it("should allow the owner to declare victory", async function () {
    await contract.connect(addr1).registerClan();
    await contract.connect(addr2).registerClan();
    await contract
      .connect(addr1)
      .setReady({ value: hre.ethers.parseEther("1") });
    await contract
      .connect(addr2)
      .setReady({ value: hre.ethers.parseEther("1") });
    await contract
      .connect(addr1)
      .wageWar(addr2.address, { value: hre.ethers.parseEther("1") });
    await expect(contract.connect(owner).declareVictory(1, 1))
      .to.emit(contract, "WarResult")
      .withArgs(1, 1);
    const war = await contract.wars(0);
    expect(war.result).to.equal(1);
  });
});
