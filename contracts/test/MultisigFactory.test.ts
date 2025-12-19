import { expect } from "chai";
import { ethers } from "hardhat";
import { MultisigFactory, MultisigWallet } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("MultisigFactory", function () {
  let factory: MultisigFactory;
  let owner1: SignerWithAddress;
  let owner2: SignerWithAddress;
  let owner3: SignerWithAddress;
  let creator1: SignerWithAddress;
  let creator2: SignerWithAddress;

  beforeEach(async function () {
    [owner1, owner2, owner3, creator1, creator2] = await ethers.getSigners();

    const MultisigFactory = await ethers.getContractFactory("MultisigFactory");
    factory = await MultisigFactory.deploy();
  });

  describe("Create Multisig", function () {
    it("Should create a new multisig wallet", async function () {
      const owners = [owner1.address, owner2.address];
      const threshold = 2;

      const tx = await factory
        .connect(creator1)
        .createMultisig(owners, threshold);
      const receipt = await tx.wait();

      expect(await factory.getWalletCount()).to.equal(1);

      // Check event emission
      const event = receipt?.logs.find(
        (log: any) => log.fragment && log.fragment.name === "MultisigCreated"
      );
      expect(event).to.not.be.undefined;
    });

    it("Should emit MultisigCreated event with correct parameters", async function () {
      const owners = [owner1.address, owner2.address];
      const threshold = 2;

      await expect(factory.connect(creator1).createMultisig(owners, threshold))
        .to.emit(factory, "MultisigCreated")
        .withArgs(
          await factory.allWallets(0).then((addr) => addr),
          creator1.address,
          owners,
          threshold,
          await ethers.provider.getBlock("latest").then((b) => b!.timestamp + 1)
        );
    });

    it("Should track wallet by creator", async function () {
      const owners = [owner1.address, owner2.address];
      const threshold = 2;

      await factory.connect(creator1).createMultisig(owners, threshold);
      await factory.connect(creator1).createMultisig(owners, threshold);

      const walletsByCreator = await factory.getWalletsByCreator(
        creator1.address
      );
      expect(walletsByCreator.length).to.equal(2);
    });

    it("Should track multiple creators separately", async function () {
      const owners = [owner1.address, owner2.address];
      const threshold = 2;

      await factory.connect(creator1).createMultisig(owners, threshold);
      await factory.connect(creator2).createMultisig(owners, threshold);

      const wallets1 = await factory.getWalletsByCreator(creator1.address);
      const wallets2 = await factory.getWalletsByCreator(creator2.address);

      expect(wallets1.length).to.equal(1);
      expect(wallets2.length).to.equal(1);
      expect(wallets1[0]).to.not.equal(wallets2[0]);
    });

    it("Should mark created address as a wallet", async function () {
      const owners = [owner1.address, owner2.address];
      const threshold = 2;

      await factory.connect(creator1).createMultisig(owners, threshold);

      const walletAddress = await factory.allWallets(0);
      expect(await factory.isWallet(walletAddress)).to.be.true;
    });

    it("Should store creation timestamp", async function () {
      const owners = [owner1.address, owner2.address];
      const threshold = 2;

      const blockBefore = await ethers.provider.getBlock("latest");
      await factory.connect(creator1).createMultisig(owners, threshold);

      const walletAddress = await factory.allWallets(0);
      const createdAt = await factory.walletCreatedAt(walletAddress);

      expect(createdAt).to.be.gt(blockBefore!.timestamp);
    });

    it("Should create functional multisig wallet", async function () {
      const owners = [owner1.address, owner2.address];
      const threshold = 2;

      await factory.connect(creator1).createMultisig(owners, threshold);

      const walletAddress = await factory.allWallets(0);
      const multisig = await ethers.getContractAt(
        "MultisigWallet",
        walletAddress
      );

      expect(await multisig.threshold()).to.equal(threshold);
      expect(await multisig.isOwner(owner1.address)).to.be.true;
      expect(await multisig.isOwner(owner2.address)).to.be.true;
    });

    it("Should propagate constructor errors from MultisigWallet", async function () {
      // Invalid threshold
      await expect(
        factory.connect(creator1).createMultisig([owner1.address], 2)
      ).to.be.reverted;

      // No owners
      await expect(factory.connect(creator1).createMultisig([], 1)).to.be
        .reverted;

      // Duplicate owners
      await expect(
        factory
          .connect(creator1)
          .createMultisig([owner1.address, owner1.address], 1)
      ).to.be.reverted;
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      // Create multiple wallets
      await factory
        .connect(creator1)
        .createMultisig([owner1.address, owner2.address], 2);
      await factory
        .connect(creator1)
        .createMultisig([owner1.address, owner3.address], 2);
      await factory
        .connect(creator2)
        .createMultisig([owner2.address, owner3.address], 2);
    });

    it("Should return all wallets", async function () {
      const allWallets = await factory.getAllWallets();
      expect(allWallets.length).to.equal(3);
    });

    it("Should return wallets by creator", async function () {
      const wallets1 = await factory.getWalletsByCreator(creator1.address);
      const wallets2 = await factory.getWalletsByCreator(creator2.address);

      expect(wallets1.length).to.equal(2);
      expect(wallets2.length).to.equal(1);
    });

    it("Should return wallets by owner", async function () {
      const walletsByOwner1 = await factory.getWalletsByOwner(owner1.address);
      const walletsByOwner2 = await factory.getWalletsByOwner(owner2.address);
      const walletsByOwner3 = await factory.getWalletsByOwner(owner3.address);

      expect(walletsByOwner1.length).to.equal(2);
      expect(walletsByOwner2.length).to.equal(2);
      expect(walletsByOwner3.length).to.equal(2);
    });

    it("Should return empty array for address with no wallets", async function () {
      const [, , , , , nobody] = await ethers.getSigners();
      const wallets = await factory.getWalletsByCreator(nobody.address);
      expect(wallets.length).to.equal(0);
    });

    it("Should return correct wallet count", async function () {
      expect(await factory.getWalletCount()).to.equal(3);
    });

    it("Should return correct wallet info", async function () {
      const walletAddress = await factory.allWallets(0);
      const info = await factory.getWalletInfo(walletAddress);

      expect(info[0]).to.equal(creator1.address); // creator
      expect(info[1]).to.be.gt(0); // createdAt
      expect(info[2]).to.deep.equal([owner1.address, owner2.address]); // owners
      expect(info[3]).to.equal(2); // threshold
    });

    it("Should revert when querying non-wallet address", async function () {
      await expect(
        factory.getWalletInfo(creator1.address)
      ).to.be.revertedWith("Not a wallet created by this factory");
    });
  });

  describe("Integration", function () {
    it("Should create wallet with single owner and threshold 1", async function () {
      await factory.connect(creator1).createMultisig([owner1.address], 1);

      const walletAddress = await factory.allWallets(0);
      const multisig = await ethers.getContractAt(
        "MultisigWallet",
        walletAddress
      );

      expect(await multisig.threshold()).to.equal(1);
      expect(await multisig.isOwner(owner1.address)).to.be.true;
    });

    it("Should create wallet with many owners", async function () {
      const owners = [
        owner1.address,
        owner2.address,
        owner3.address,
        creator1.address,
        creator2.address,
      ];
      await factory.connect(creator1).createMultisig(owners, 3);

      const walletAddress = await factory.allWallets(0);
      const multisig = await ethers.getContractAt(
        "MultisigWallet",
        walletAddress
      );

      const walletOwners = await multisig.getOwners();
      expect(walletOwners).to.deep.equal(owners);
    });

    it("Should allow wallet to receive and manage funds", async function () {
      await factory
        .connect(creator1)
        .createMultisig([owner1.address, owner2.address], 2);

      const walletAddress = await factory.allWallets(0);
      const multisig = (await ethers.getContractAt(
        "MultisigWallet",
        walletAddress
      )) as MultisigWallet;

      // Send ETH to wallet
      await owner1.sendTransaction({
        to: walletAddress,
        value: ethers.parseEther("1.0"),
      });

      expect(await ethers.provider.getBalance(walletAddress)).to.equal(
        ethers.parseEther("1.0")
      );

      // Submit transaction
      await multisig.connect(owner1).submitTransaction(
        creator1.address,
        ethers.parseEther("0.5"),
        "0x"
      );

      // Approve and execute
      await multisig.connect(owner1).approveTransaction(0);
      await multisig.connect(owner2).approveTransaction(0);
      await multisig.connect(owner1).executeTransaction(0);

      expect(await ethers.provider.getBalance(walletAddress)).to.equal(
        ethers.parseEther("0.5")
      );
    });
  });

  describe("Gas Optimization", function () {
    it("Should have reasonable gas cost for wallet creation", async function () {
      const tx = await factory
        .connect(creator1)
        .createMultisig([owner1.address, owner2.address, owner3.address], 2);
      const receipt = await tx.wait();

      expect(receipt!.gasUsed).to.be.lt(1000000); // Less than 1M gas
    });
  });
});
