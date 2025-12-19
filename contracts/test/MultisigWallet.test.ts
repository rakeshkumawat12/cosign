import { expect } from "chai";
import { ethers } from "hardhat";
import { MultisigWallet } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("MultisigWallet", function () {
  let multisig: MultisigWallet;
  let owner1: SignerWithAddress;
  let owner2: SignerWithAddress;
  let owner3: SignerWithAddress;
  let nonOwner: SignerWithAddress;
  let recipient: SignerWithAddress;

  const THRESHOLD = 2;

  beforeEach(async function () {
    [owner1, owner2, owner3, nonOwner, recipient] = await ethers.getSigners();

    const MultisigWallet = await ethers.getContractFactory("MultisigWallet");
    multisig = await MultisigWallet.deploy(
      [owner1.address, owner2.address, owner3.address],
      THRESHOLD
    );
  });

  describe("Deployment", function () {
    it("Should set the correct owners", async function () {
      expect(await multisig.isOwner(owner1.address)).to.be.true;
      expect(await multisig.isOwner(owner2.address)).to.be.true;
      expect(await multisig.isOwner(owner3.address)).to.be.true;
      expect(await multisig.isOwner(nonOwner.address)).to.be.false;
    });

    it("Should set the correct threshold", async function () {
      expect(await multisig.threshold()).to.equal(THRESHOLD);
    });

    it("Should return correct owners array", async function () {
      const owners = await multisig.getOwners();
      expect(owners).to.deep.equal([
        owner1.address,
        owner2.address,
        owner3.address,
      ]);
    });

    it("Should revert if no owners provided", async function () {
      const MultisigWallet = await ethers.getContractFactory("MultisigWallet");
      await expect(MultisigWallet.deploy([], 1)).to.be.revertedWithCustomError(
        multisig,
        "InvalidOwner"
      );
    });

    it("Should revert if threshold is zero", async function () {
      const MultisigWallet = await ethers.getContractFactory("MultisigWallet");
      await expect(
        MultisigWallet.deploy([owner1.address], 0)
      ).to.be.revertedWithCustomError(multisig, "InvalidThreshold");
    });

    it("Should revert if threshold exceeds owner count", async function () {
      const MultisigWallet = await ethers.getContractFactory("MultisigWallet");
      await expect(
        MultisigWallet.deploy([owner1.address], 2)
      ).to.be.revertedWithCustomError(multisig, "InvalidThreshold");
    });

    it("Should revert if owner address is zero", async function () {
      const MultisigWallet = await ethers.getContractFactory("MultisigWallet");
      await expect(
        MultisigWallet.deploy([ethers.ZeroAddress], 1)
      ).to.be.revertedWithCustomError(multisig, "InvalidOwner");
    });

    it("Should revert if duplicate owners", async function () {
      const MultisigWallet = await ethers.getContractFactory("MultisigWallet");
      await expect(
        MultisigWallet.deploy([owner1.address, owner1.address], 1)
      ).to.be.revertedWithCustomError(multisig, "OwnerNotUnique");
    });
  });

  describe("Receive ETH", function () {
    it("Should receive ETH and emit Deposit event", async function () {
      const amount = ethers.parseEther("1.0");
      await expect(
        owner1.sendTransaction({ to: await multisig.getAddress(), value: amount })
      )
        .to.emit(multisig, "Deposit")
        .withArgs(owner1.address, amount, amount);

      expect(await ethers.provider.getBalance(await multisig.getAddress())).to.equal(
        amount
      );
    });
  });

  describe("Submit Transaction", function () {
    it("Should allow owner to submit transaction", async function () {
      const tx = await multisig
        .connect(owner1)
        .submitTransaction(recipient.address, ethers.parseEther("1.0"), "0x");

      expect(await multisig.getTransactionCount()).to.equal(1);

      await expect(tx)
        .to.emit(multisig, "TransactionSubmitted")
        .withArgs(
          0,
          recipient.address,
          ethers.parseEther("1.0"),
          "0x",
          owner1.address
        );
    });

    it("Should revert if non-owner tries to submit", async function () {
      await expect(
        multisig
          .connect(nonOwner)
          .submitTransaction(recipient.address, ethers.parseEther("1.0"), "0x")
      ).to.be.revertedWithCustomError(multisig, "NotOwner");
    });

    it("Should handle transaction with data", async function () {
      const data = "0x1234";
      await multisig
        .connect(owner1)
        .submitTransaction(recipient.address, 0, data);

      const txData = await multisig.getTransaction(0);
      expect(txData[2]).to.equal(data);
    });
  });

  describe("Approve Transaction", function () {
    beforeEach(async function () {
      await owner1.sendTransaction({
        to: await multisig.getAddress(),
        value: ethers.parseEther("10.0"),
      });
      await multisig
        .connect(owner1)
        .submitTransaction(recipient.address, ethers.parseEther("1.0"), "0x");
    });

    it("Should allow owner to approve transaction", async function () {
      await expect(multisig.connect(owner1).approveTransaction(0))
        .to.emit(multisig, "TransactionApproved")
        .withArgs(0, owner1.address);

      expect(await multisig.hasApproved(0, owner1.address)).to.be.true;

      const tx = await multisig.getTransaction(0);
      expect(tx[4]).to.equal(1); // numApprovals
    });

    it("Should revert if non-owner tries to approve", async function () {
      await expect(
        multisig.connect(nonOwner).approveTransaction(0)
      ).to.be.revertedWithCustomError(multisig, "NotOwner");
    });

    it("Should revert if transaction does not exist", async function () {
      await expect(
        multisig.connect(owner1).approveTransaction(999)
      ).to.be.revertedWithCustomError(multisig, "TransactionDoesNotExist");
    });

    it("Should revert if owner tries to approve twice", async function () {
      await multisig.connect(owner1).approveTransaction(0);
      await expect(
        multisig.connect(owner1).approveTransaction(0)
      ).to.be.revertedWithCustomError(multisig, "TransactionAlreadyApproved");
    });

    it("Should track multiple approvals", async function () {
      await multisig.connect(owner1).approveTransaction(0);
      await multisig.connect(owner2).approveTransaction(0);

      const tx = await multisig.getTransaction(0);
      expect(tx[4]).to.equal(2);

      const approvals = await multisig.getApprovals(0);
      expect(approvals).to.deep.equal([owner1.address, owner2.address]);
    });
  });

  describe("Revoke Approval", function () {
    beforeEach(async function () {
      await owner1.sendTransaction({
        to: await multisig.getAddress(),
        value: ethers.parseEther("10.0"),
      });
      await multisig
        .connect(owner1)
        .submitTransaction(recipient.address, ethers.parseEther("1.0"), "0x");
      await multisig.connect(owner1).approveTransaction(0);
    });

    it("Should allow owner to revoke approval", async function () {
      await expect(multisig.connect(owner1).revokeApproval(0))
        .to.emit(multisig, "TransactionRevoked")
        .withArgs(0, owner1.address);

      expect(await multisig.hasApproved(0, owner1.address)).to.be.false;

      const tx = await multisig.getTransaction(0);
      expect(tx[4]).to.equal(0);
    });

    it("Should revert if transaction not approved by caller", async function () {
      await expect(
        multisig.connect(owner2).revokeApproval(0)
      ).to.be.revertedWithCustomError(multisig, "TransactionNotApproved");
    });

    it("Should revert if non-owner tries to revoke", async function () {
      await expect(
        multisig.connect(nonOwner).revokeApproval(0)
      ).to.be.revertedWithCustomError(multisig, "NotOwner");
    });
  });

  describe("Execute Transaction", function () {
    beforeEach(async function () {
      await owner1.sendTransaction({
        to: await multisig.getAddress(),
        value: ethers.parseEther("10.0"),
      });
      await multisig
        .connect(owner1)
        .submitTransaction(recipient.address, ethers.parseEther("1.0"), "0x");
    });

    it("Should execute transaction with sufficient approvals", async function () {
      await multisig.connect(owner1).approveTransaction(0);
      await multisig.connect(owner2).approveTransaction(0);

      const balanceBefore = await ethers.provider.getBalance(recipient.address);

      await expect(multisig.connect(owner3).executeTransaction(0))
        .to.emit(multisig, "TransactionExecuted")
        .withArgs(0, owner3.address);

      const balanceAfter = await ethers.provider.getBalance(recipient.address);
      expect(balanceAfter - balanceBefore).to.equal(ethers.parseEther("1.0"));

      const tx = await multisig.getTransaction(0);
      expect(tx[3]).to.be.true; // executed
    });

    it("Should revert if insufficient approvals", async function () {
      await multisig.connect(owner1).approveTransaction(0);

      await expect(
        multisig.connect(owner1).executeTransaction(0)
      ).to.be.revertedWithCustomError(multisig, "InsufficientApprovals");
    });

    it("Should revert if already executed", async function () {
      await multisig.connect(owner1).approveTransaction(0);
      await multisig.connect(owner2).approveTransaction(0);
      await multisig.connect(owner3).executeTransaction(0);

      await expect(
        multisig.connect(owner1).executeTransaction(0)
      ).to.be.revertedWithCustomError(multisig, "TransactionAlreadyExecuted");
    });

    it("Should revert if non-owner tries to execute", async function () {
      await multisig.connect(owner1).approveTransaction(0);
      await multisig.connect(owner2).approveTransaction(0);

      await expect(
        multisig.connect(nonOwner).executeTransaction(0)
      ).to.be.revertedWithCustomError(multisig, "NotOwner");
    });

    it("Should not allow approval after execution", async function () {
      await multisig.connect(owner1).approveTransaction(0);
      await multisig.connect(owner2).approveTransaction(0);
      await multisig.connect(owner3).executeTransaction(0);

      await expect(
        multisig.connect(owner3).approveTransaction(0)
      ).to.be.revertedWithCustomError(multisig, "TransactionAlreadyExecuted");
    });

    it("Should handle execution with exact threshold", async function () {
      // Deploy wallet with threshold 2
      const MultisigWallet = await ethers.getContractFactory("MultisigWallet");
      const wallet = await MultisigWallet.deploy(
        [owner1.address, owner2.address],
        2
      );

      await owner1.sendTransaction({
        to: await wallet.getAddress(),
        value: ethers.parseEther("10.0"),
      });

      await wallet
        .connect(owner1)
        .submitTransaction(recipient.address, ethers.parseEther("1.0"), "0x");

      await wallet.connect(owner1).approveTransaction(0);
      await wallet.connect(owner2).approveTransaction(0);

      const balanceBefore = await ethers.provider.getBalance(recipient.address);
      await wallet.connect(owner1).executeTransaction(0);
      const balanceAfter = await ethers.provider.getBalance(recipient.address);

      expect(balanceAfter - balanceBefore).to.equal(ethers.parseEther("1.0"));
    });
  });

  describe("Reentrancy Protection", function () {
    it("Should protect against reentrancy attacks", async function () {
      // Deploy a malicious contract that tries to reenter
      const MaliciousContract = await ethers.getContractFactory(
        "MaliciousReentrancy"
      );
      const malicious = await MaliciousContract.deploy();

      // Fund the multisig
      await owner1.sendTransaction({
        to: await multisig.getAddress(),
        value: ethers.parseEther("10.0"),
      });

      // Submit transaction to malicious contract
      await multisig
        .connect(owner1)
        .submitTransaction(
          await malicious.getAddress(),
          ethers.parseEther("1.0"),
          "0x"
        );

      // Get approvals
      await multisig.connect(owner1).approveTransaction(0);
      await multisig.connect(owner2).approveTransaction(0);

      // Set the multisig address in malicious contract
      await malicious.setMultisig(await multisig.getAddress());

      // Attempt execution - should revert due to reentrancy guard
      await expect(
        multisig.connect(owner1).executeTransaction(0)
      ).to.be.revertedWithCustomError(multisig, "ReentrancyGuard");
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero value transactions", async function () {
      await multisig
        .connect(owner1)
        .submitTransaction(recipient.address, 0, "0x");

      await multisig.connect(owner1).approveTransaction(0);
      await multisig.connect(owner2).approveTransaction(0);

      await expect(multisig.connect(owner3).executeTransaction(0)).to.emit(
        multisig,
        "TransactionExecuted"
      );
    });

    it("Should handle large number of transactions", async function () {
      for (let i = 0; i < 10; i++) {
        await multisig
          .connect(owner1)
          .submitTransaction(recipient.address, 0, "0x");
      }

      expect(await multisig.getTransactionCount()).to.equal(10);
    });
  });
});

// Helper contract for reentrancy testing
contract MaliciousReentrancy {
    address public multisig;

    function setMultisig(address _multisig) external {
        multisig = _multisig;
    }

    receive() external payable {
        if (multisig != address(0)) {
            // Try to execute another transaction during receive
            (bool success, ) = multisig.call(
                abi.encodeWithSignature("executeTransaction(uint256)", 0)
            );
        }
    }
}
