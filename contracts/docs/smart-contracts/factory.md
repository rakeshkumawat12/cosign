# MultisigFactory Smart Contract

## Overview

Factory contract for deploying and tracking MultisigWallet instances. Maintains global registry and provides lookup functions for wallets by creator or owner.

## Key Functions

### createMultisig
```solidity
function createMultisig(address[] memory owners, uint256 threshold)
    external
    returns (address wallet)
```

Deploys a new MultisigWallet contract.

**Returns:** Address of created wallet

**Events:** `MultisigCreated(wallet, creator, owners, threshold, timestamp)`

**Gas:** ~500k (includes wallet deployment)

### View Functions

- `getAllWallets()`: Returns all deployed wallets
- `getWalletsByCreator(address)`: Wallets created by specific address
- `getWalletsByOwner(address)`: Wallets where address is an owner
- `getWalletInfo(address)`: Complete wallet metadata
- `getWalletCount()`: Total wallets deployed

## Usage

```typescript
const factory = await ethers.getContractAt("MultisigFactory", FACTORY_ADDRESS);
const tx = await factory.createMultisig(
  [owner1, owner2, owner3],
  2
);
const receipt = await tx.wait();
```

## Integration Notes

- Frontend should listen to `MultisigCreated` events
- Use `getWalletsByOwner` to fetch user's wallets
- Factory address is fixed per network (no upgrades)
- Consider using subgraph for production `getWalletsByOwner`

## Security

- No admin functions (fully decentralized)
- Anyone can create wallets
- Creator has no special privileges over wallet
- Factory cannot modify wallets post-deployment
