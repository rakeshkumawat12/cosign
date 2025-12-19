import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("Creating sample multisig wallet...\n");

  // Get deployment info
  const network = await ethers.provider.getNetwork();
  const deploymentFile = path.join(
    __dirname,
    "..",
    "deployments",
    `${network.name}-${network.chainId}.json`
  );

  if (!fs.existsSync(deploymentFile)) {
    console.error("Deployment file not found. Please deploy contracts first.");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  console.log("Using factory at:", deployment.factoryAddress);

  const [owner1, owner2, owner3] = await ethers.getSigners();
  console.log("Owner 1:", owner1.address);
  console.log("Owner 2:", owner2.address);
  console.log("Owner 3:", owner3.address);

  // Get factory contract
  const factory = await ethers.getContractAt(
    "MultisigFactory",
    deployment.factoryAddress
  );

  // Create multisig wallet
  console.log("\nCreating multisig with 2-of-3 threshold...");
  const tx = await factory
    .connect(owner1)
    .createMultisig(
      [owner1.address, owner2.address, owner3.address],
      2
    );

  const receipt = await tx.wait();
  console.log("Transaction hash:", receipt?.hash);

  // Get the created wallet address from events
  const event = receipt?.logs.find(
    (log: any) => log.fragment && log.fragment.name === "MultisigCreated"
  );

  if (event) {
    const walletAddress = (event as any).args[0];
    console.log("\nMultisig wallet created!");
    console.log("Wallet address:", walletAddress);

    // Fund the wallet
    console.log("\nFunding wallet with 1 ETH...");
    const fundTx = await owner1.sendTransaction({
      to: walletAddress,
      value: ethers.parseEther("1.0"),
    });
    await fundTx.wait();

    console.log("Wallet funded successfully");

    // Submit a test transaction
    const multisig = await ethers.getContractAt(
      "MultisigWallet",
      walletAddress
    );

    console.log("\nSubmitting test transaction...");
    const submitTx = await multisig
      .connect(owner1)
      .submitTransaction(owner3.address, ethers.parseEther("0.1"), "0x");
    await submitTx.wait();

    console.log("Test transaction submitted (ID: 0)");
    console.log("\nSample wallet setup complete!");
    console.log("Wallet address:", walletAddress);
    console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(walletAddress)), "ETH");
    console.log("Owners:", await multisig.getOwners());
    console.log("Threshold:", await multisig.threshold());
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
