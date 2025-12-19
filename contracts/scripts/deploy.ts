import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("Deploying Cosign Multisig System...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH\n");

  // Deploy MultisigFactory
  console.log("Deploying MultisigFactory...");
  const MultisigFactory = await ethers.getContractFactory("MultisigFactory");
  const factory = await MultisigFactory.deploy();
  await factory.waitForDeployment();

  const factoryAddress = await factory.getAddress();
  console.log("MultisigFactory deployed to:", factoryAddress);

  // Get network information
  const network = await ethers.provider.getNetwork();
  console.log("\nNetwork:", network.name);
  console.log("Chain ID:", network.chainId.toString());

  // Save deployment addresses
  const deploymentInfo = {
    network: network.name,
    chainId: network.chainId.toString(),
    factoryAddress: factoryAddress,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  const deploymentFile = path.join(
    deploymentsDir,
    `${network.name}-${network.chainId}.json`
  );

  fs.writeFileSync(
    deploymentFile,
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\nDeployment info saved to:", deploymentFile);

  // Create .env.local file for Next.js
  const envContent = `
# Auto-generated deployment configuration
# Generated at: ${deploymentInfo.deployedAt}

NEXT_PUBLIC_FACTORY_ADDRESS=${factoryAddress}
NEXT_PUBLIC_CHAIN_ID=${network.chainId}
NEXT_PUBLIC_NETWORK=${network.name}
`;

  const envFile = path.join(__dirname, "..", "..", "frontend", ".env.local");
  fs.writeFileSync(envFile, envContent.trim());
  console.log("Environment file created:", envFile);

  console.log("\nDeployment Summary:");
  console.log("===================");
  console.log("Factory Address:", factoryAddress);
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId.toString());
  console.log("\nNext steps:");
  console.log("1. Verify contract on Etherscan (for testnet/mainnet)");
  console.log("2. Update frontend to use new factory address");
  console.log("3. Test wallet creation through UI");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
