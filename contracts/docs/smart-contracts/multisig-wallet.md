# MultisigWallet Smart Contract

## Overview

The `MultisigWallet` contract is a secure multi-signature wallet that requires multiple owner approvals before executing transactions. It implements industry-standard security patterns including reentrancy protection and comprehensive access controls.

## Contract Details

- **Solidity Version**: ^0.8.27
- **License**: MIT
- **Audit Status**: Pending (Phase 2 - Ready for audit)

## Architecture

### State Variables

```solidity
struct Transaction {
    address to;          // Destination address
    uint256 value;       // ETH value to send
    bytes data;          // Call data for contract interactions
    bool executed;       // Execution status
    uint256 numApprovals; // Current approval count
}

address[] public owners;                        // Array of owner addresses
mapping(address => bool) public isOwner;        // Quick owner lookup
uint256 public threshold;                       // Required approvals
Transaction[] public transactions;              // All transactions
mapping(uint256 => mapping(address => bool)) public approved; // Approvals
```

### Security Features

1. **Reentrancy Protection**
   - Uses custom reentrancy guard pattern
   - Protects `executeTransaction` function
   - Gas-efficient implementation

2. **Access Control**
   - `onlyOwner` modifier for all state-changing functions
   - Owner validation on deployment
   - No duplicate owners allowed

3. **Transaction Safety**
   - No double approvals
   - Execute only after threshold met
   - Execute only once per transaction
   - Validation on every state change

## Functions

### Constructor

```solidity
constructor(address[] memory _owners, uint256 _threshold)
```

**Parameters:**
- `_owners`: Array of owner addresses
- `_threshold`: Number of required approvals

**Validations:**
- At least one owner required
- Threshold must be ≥ 1 and ≤ owner count
- No zero addresses
- No duplicate owners

**Events:**
- Emits `OwnerAdded` for each owner

---

### submitTransaction

```solidity
function submitTransaction(
    address to,
    uint256 value,
    bytes calldata data
) external onlyOwner returns (uint256 txId)
```

**Description:** Submit a new transaction for approval

**Access:** Owners only

**Parameters:**
- `to`: Destination address
- `value`: ETH amount to send
- `data`: Call data (use `0x` for simple ETH transfer)

**Returns:** Transaction ID

**Events:** `TransactionSubmitted`

**Gas Cost:** ~100k gas

---

### approveTransaction

```solidity
function approveTransaction(uint256 txId) external onlyOwner
```

**Description:** Approve a pending transaction

**Access:** Owners only

**Requirements:**
- Transaction must exist
- Transaction not executed
- Caller hasn't already approved

**Events:** `TransactionApproved`

**Gas Cost:** ~50k gas

---

### revokeApproval

```solidity
function revokeApproval(uint256 txId) external onlyOwner
```

**Description:** Revoke a previous approval

**Access:** Owners only

**Requirements:**
- Transaction must exist
- Transaction not executed
- Caller has previously approved

**Events:** `TransactionRevoked`

**Gas Cost:** ~30k gas

---

### executeTransaction

```solidity
function executeTransaction(uint256 txId) external onlyOwner
```

**Description:** Execute an approved transaction

**Access:** Owners only (any owner can execute)

**Requirements:**
- Transaction must exist
- Transaction not executed
- Sufficient approvals (≥ threshold)

**Events:** `TransactionExecuted`

**Security:**
- Reentrancy protected
- Checks-effects-interactions pattern
- Reverts if execution fails

**Gas Cost:** ~70k gas (+ destination gas)

---

### View Functions

#### getOwners

```solidity
function getOwners() external view returns (address[] memory)
```

Returns array of all owner addresses.

#### getTransactionCount

```solidity
function getTransactionCount() external view returns (uint256)
```

Returns total number of transactions.

#### getTransaction

```solidity
function getTransaction(uint256 txId)
    external
    view
    returns (
        address to,
        uint256 value,
        bytes memory data,
        bool executed,
        uint256 numApprovals
    )
```

Returns complete transaction details.

#### hasApproved

```solidity
function hasApproved(uint256 txId, address owner)
    external
    view
    returns (bool)
```

Check if an owner has approved a transaction.

#### getApprovals

```solidity
function getApprovals(uint256 txId)
    external
    view
    returns (address[] memory)
```

Get all owners who approved a transaction.

## Events

```solidity
event Deposit(address indexed sender, uint256 amount, uint256 balance);
event TransactionSubmitted(uint256 indexed txId, address indexed to, uint256 value, bytes data, address indexed submitter);
event TransactionApproved(uint256 indexed txId, address indexed owner);
event TransactionRevoked(uint256 indexed txId, address indexed owner);
event TransactionExecuted(uint256 indexed txId, address indexed executor);
event OwnerAdded(address indexed owner);
```

## Usage Examples

### Creating a Wallet

```typescript
const multisig = await MultisigWallet.deploy(
  [owner1.address, owner2.address, owner3.address],
  2  // 2-of-3 threshold
);
```

### Funding the Wallet

```typescript
await signer.sendTransaction({
  to: multisigAddress,
  value: ethers.parseEther("10.0")
});
```

### Submitting a Transaction

```typescript
const tx = await multisig.submitTransaction(
  recipient.address,
  ethers.parseEther("1.0"),
  "0x"  // No call data for simple transfer
);
const receipt = await tx.wait();
const txId = 0; // First transaction
```

### Approving a Transaction

```typescript
// Owner 1 approves
await multisig.connect(owner1).approveTransaction(txId);

// Owner 2 approves (reaches threshold)
await multisig.connect(owner2).approveTransaction(txId);
```

### Executing a Transaction

```typescript
// Any owner can execute after threshold is met
await multisig.connect(owner3).executeTransaction(txId);
```

## Security Considerations

### ✅ Implemented Protections

1. **Reentrancy**: Custom guard with minimal gas overhead
2. **Access Control**: Strict owner-only modifications
3. **Integer Overflow**: Solidity 0.8.x built-in protection
4. **Transaction Replay**: Single execution per transaction
5. **Front-running**: Decentralized approval process mitigates risk

### ⚠️ Known Limitations

1. **Owner Management**: Owners cannot be added/removed post-deployment
2. **Threshold Updates**: Threshold is fixed at deployment
3. **Gas Limits**: Large owner sets may hit gas limits in `getApprovals`
4. **No Cancellation**: Submitted transactions cannot be cancelled, only ignored

### 🔒 Best Practices

1. **Threshold Setting**: Use at least 2-of-3 for meaningful security
2. **Owner Selection**: Only use trusted, non-contract addresses as owners
3. **Transaction Data**: Carefully review `data` field before approving
4. **Execution Timing**: Monitor for sufficient approvals before executing
5. **Emergency Protocol**: Have off-chain coordination for urgent situations

## Upgrade Path

The contract is not upgradeable by design. To migrate:

1. Deploy new wallet version
2. Submit transaction to transfer all funds
3. Approve and execute transfer
4. Update frontend to point to new wallet

## Gas Optimization Notes

- Uses `struct` for compact transaction storage
- Minimal storage reads/writes
- Events for frontend indexing (cheaper than storage)
- Approval count cached in struct
- ViaIR optimizer enabled for better efficiency

## Testing Coverage

See `test/MultisigWallet.test.ts` for comprehensive test suite covering:

- ✅ Deployment validation
- ✅ ETH deposits
- ✅ Transaction submission
- ✅ Approval/revocation flow
- ✅ Execution with threshold
- ✅ Reentrancy attack prevention
- ✅ Access control enforcement
- ✅ Edge cases

## Integration with Factory

Wallets are deployed via `MultisigFactory.createMultisig()`:

```typescript
const factoryTx = await factory.createMultisig(owners, threshold);
const receipt = await factoryTx.wait();
const walletAddress = receipt.events[0].args.wallet;
```

## Frontend Integration

See `lib/contracts/` for React hooks and ethers.js utilities that interact with this contract.

Key integration points:
- Listen to events for real-time updates
- Query transaction count before loading transactions
- Use `getApprovals` to display approval status
- Check `hasApproved` before showing approve button
