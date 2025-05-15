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
    try {
      [owner, addr1, addr2, addr3] = await hre.ethers.getSigners();
      const ClashOfLens = await hre.ethers.getContractFactory(
        "ClashOfLensContract"
      );
      contract = await ClashOfLens.deploy(owner.address);
      console.log("Deployed at:", contract.target);
    } catch (err) {
      console.error("Deployment error:", err);
      throw err;
    }
  });

  it("should deploy successfully", async function () {
    expect(contract.target).to.be.a("string");
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

  it("should allow a user to deposit balance to a clan", async function () {
    await contract.connect(addr1).registerClan();
    await expect(
      contract
        .connect(addr1)
        .depositBalance(addr1.address, { value: hre.ethers.parseEther("2") })
    ).to.changeEtherBalances([contract], [hre.ethers.parseEther("2")]);
    const balance = await contract.clanBalances(addr1.address);
    expect(balance).to.equal(hre.ethers.parseEther("2"));
  });

  it("should allow a spectator to bet on a war", async function () {
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
    await expect(
      contract
        .connect(addr3)
        .betOnWar(1, 1, { value: hre.ethers.parseEther("0.5") })
    ).to.not.be.reverted;
    const bet = await contract.warBets(0);
    expect(bet.bettor).to.equal(addr3.address);
    expect(bet.outcome).to.equal(1);
    expect(bet.warId).to.equal(1);
  });

  it("should allow the winning clan to claim both stakes", async function () {
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
    await contract.connect(owner).declareVictory(1, 1);
    const before = await hre.ethers.provider.getBalance(addr1.address);
    const tx = await contract.connect(addr1).claimWin(1);
    const receipt = await tx.wait();
    const after = await hre.ethers.provider.getBalance(addr1.address);
    expect(after).to.be.gt(before);
    const c1bal = await contract.clanBalances(addr1.address);
    const c2bal = await contract.clanBalances(addr2.address);
    expect(c1bal).to.equal(0);
    expect(c2bal).to.equal(0);
  });
});
