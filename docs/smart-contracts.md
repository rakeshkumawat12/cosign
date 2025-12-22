# Smart Contracts

## Overview

CoSign uses two main contracts:
- **MultisigFactory** - Deploys and tracks wallets
- **MultisigWallet** - Manages transactions and approvals

## MultisigFactory.sol

### Purpose
Factory pattern for deploying new multisig wallets.

### Key Functions

```solidity
function createMultisig(
    address[] memory _owners,
    uint256 _requiredApprovals,
    string memory _name
) public returns (address)
```
- Deploys new MultisigWallet
- Validates owners and threshold
- Tracks wallet by creator
- Emits `MultisigCreated` event

```solidity
function getWalletsByCreator(address _creator)
    public view returns (address[] memory)
```
- Returns all wallets created by an address
- Used by frontend to load user's wallets

### Events
```solidity
event MultisigCreated(
    address indexed wallet,
    address indexed creator,
    address[] owners,
    uint256 requiredApprovals,
    uint256 timestamp
);
```

## MultisigWallet.sol

### Purpose
Individual multisig wallet that requires M-of-N approvals.

### Key Functions

#### Submit Transaction
```solidity
function submitTransaction(
    address _to,
    uint256 _value,
    bytes memory _data
) public onlyOwner
```
- Only owners can submit
- Stores transaction with auto-increment ID
- Emits `TransactionSubmitted`

#### Approve Transaction
```solidity
function approveTransaction(uint256 _txId)
    public onlyOwner txExists(_txId) notExecuted(_txId)
```
- Adds approval from msg.sender
- Prevents double approvals
- Emits `TransactionApproved`

#### Execute Transaction
```solidity
function executeTransaction(uint256 _txId)
    public onlyOwner txExists(_txId) notExecuted(_txId)
```
- Requires threshold approvals
- Uses reentrancy guard
- Sends ETH to destination
- Marks transaction as executed
- Emits `TransactionExecuted`

#### Revoke Approval
```solidity
function revokeApproval(uint256 _txId)
    public onlyOwner txExists(_txId) notExecuted(_txId)
```
- Removes approval from msg.sender
- Only works for non-executed transactions

### State Variables

```solidity
address[] public owners;
mapping(address => bool) public isOwner;
uint256 public requiredApprovals;
uint256 public transactionCount;
string public name;

struct Transaction {
    address to;
    uint256 value;
    bytes data;
    bool executed;
}

mapping(uint256 => Transaction) public transactions;
mapping(uint256 => mapping(address => bool)) public approvals;
```

### Modifiers

- `onlyOwner` - Only wallet owners can call
- `txExists` - Transaction ID must exist
- `notExecuted` - Transaction not already executed

### Security Features

1. **Reentrancy Guard** - Uses OpenZeppelin's ReentrancyGuard
2. **Owner Validation** - Validates owners on deployment
3. **Threshold Validation** - Ensures `requiredApprovals ≤ owners.length`
4. **No Duplicate Approvals** - Mapping prevents double approvals
5. **Execute Once** - `executed` flag prevents replay

## Gas Optimization

- Uses mappings instead of arrays for ownership checks
- Events indexed for efficient filtering
- Minimal storage usage

## Events

All contracts emit comprehensive events for frontend consumption:

**Factory:**
- `MultisigCreated` - New wallet deployed

**Wallet:**
- `TransactionSubmitted` - New transaction created
- `TransactionApproved` - Owner approved
- `TransactionExecuted` - Transaction sent
- `ApprovalRevoked` - Owner revoked approval

## Testing

Run contract tests:
```bash
cd contracts
npx hardhat test
```

Test coverage includes:
- Deployment validation
- Transaction lifecycle
- Approval logic
- Edge cases (duplicate approvals, invalid thresholds)
- Reentrancy protection
