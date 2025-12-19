// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

/**
 * @title MultisigWallet
 * @author Cosign Protocol
 * @notice A secure multi-signature wallet requiring multiple approvals for transaction execution
 * @dev Implements reentrancy protection and strict access controls
 *
 * Security Features:
 * - Reentrancy guard on execute
 * - Owner-only transaction submission and approval
 * - Threshold validation on deployment and execution
 * - No double approvals
 * - Transaction execution protection (execute once)
 * - Events for all state changes
 */
contract MultisigWallet {
    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event Deposit(address indexed sender, uint256 amount, uint256 balance);
    event TransactionSubmitted(
        uint256 indexed txId,
        address indexed to,
        uint256 value,
        bytes data,
        address indexed submitter
    );
    event TransactionApproved(uint256 indexed txId, address indexed owner);
    event TransactionRevoked(uint256 indexed txId, address indexed owner);
    event TransactionExecuted(uint256 indexed txId, address indexed executor);
    event OwnerAdded(address indexed owner);
    event OwnerRemoved(address indexed owner);
    event ThresholdChanged(uint256 oldThreshold, uint256 newThreshold);

    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/

    error InvalidOwner();
    error InvalidThreshold();
    error OwnerNotUnique();
    error NotOwner();
    error TransactionDoesNotExist();
    error TransactionAlreadyExecuted();
    error TransactionAlreadyApproved();
    error TransactionNotApproved();
    error InsufficientApprovals();
    error TransactionExecutionFailed();
    error ReentrancyGuard();

    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/

    struct Transaction {
        address to;
        uint256 value;
        bytes data;
        bool executed;
        uint256 numApprovals;
    }

    address[] public owners;
    mapping(address => bool) public isOwner;
    uint256 public threshold;

    Transaction[] public transactions;
    // txId => owner => approved
    mapping(uint256 => mapping(address => bool)) public approved;

    // Reentrancy guard
    uint256 private _locked = 1;

    /*//////////////////////////////////////////////////////////////
                               MODIFIERS
    //////////////////////////////////////////////////////////////*/

    modifier onlyOwner() {
        if (!isOwner[msg.sender]) revert NotOwner();
        _;
    }

    modifier txExists(uint256 txId) {
        if (txId >= transactions.length) revert TransactionDoesNotExist();
        _;
    }

    modifier notExecuted(uint256 txId) {
        if (transactions[txId].executed) revert TransactionAlreadyExecuted();
        _;
    }

    modifier notApproved(uint256 txId) {
        if (approved[txId][msg.sender]) revert TransactionAlreadyApproved();
        _;
    }

    modifier nonReentrant() {
        if (_locked != 1) revert ReentrancyGuard();
        _locked = 2;
        _;
        _locked = 1;
    }

    /*//////////////////////////////////////////////////////////////
                             CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Creates a new multisig wallet
     * @param _owners Array of owner addresses
     * @param _threshold Number of required approvals for execution
     */
    constructor(address[] memory _owners, uint256 _threshold) {
        if (_owners.length == 0) revert InvalidOwner();
        if (_threshold == 0 || _threshold > _owners.length) {
            revert InvalidThreshold();
        }

        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];

            if (owner == address(0)) revert InvalidOwner();
            if (isOwner[owner]) revert OwnerNotUnique();

            isOwner[owner] = true;
            owners.push(owner);
            emit OwnerAdded(owner);
        }

        threshold = _threshold;
    }

    /*//////////////////////////////////////////////////////////////
                          RECEIVE FUNCTION
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Allows the contract to receive ETH
     */
    receive() external payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    /*//////////////////////////////////////////////////////////////
                        TRANSACTION FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Submit a new transaction for approval
     * @param to Destination address
     * @param value ETH value to send
     * @param data Call data
     * @return txId The ID of the submitted transaction
     */
    function submitTransaction(
        address to,
        uint256 value,
        bytes calldata data
    ) external onlyOwner returns (uint256 txId) {
        txId = transactions.length;

        transactions.push(
            Transaction({
                to: to,
                value: value,
                data: data,
                executed: false,
                numApprovals: 0
            })
        );

        emit TransactionSubmitted(txId, to, value, data, msg.sender);
    }

    /**
     * @notice Approve a pending transaction
     * @param txId Transaction ID to approve
     */
    function approveTransaction(uint256 txId)
        external
        onlyOwner
        txExists(txId)
        notExecuted(txId)
        notApproved(txId)
    {
        approved[txId][msg.sender] = true;
        transactions[txId].numApprovals++;

        emit TransactionApproved(txId, msg.sender);
    }

    /**
     * @notice Revoke approval for a transaction
     * @param txId Transaction ID to revoke
     */
    function revokeApproval(uint256 txId)
        external
        onlyOwner
        txExists(txId)
        notExecuted(txId)
    {
        if (!approved[txId][msg.sender]) {
            revert TransactionNotApproved();
        }

        approved[txId][msg.sender] = false;
        transactions[txId].numApprovals--;

        emit TransactionRevoked(txId, msg.sender);
    }

    /**
     * @notice Execute an approved transaction
     * @param txId Transaction ID to execute
     * @dev Includes reentrancy protection
     */
    function executeTransaction(uint256 txId)
        external
        onlyOwner
        txExists(txId)
        notExecuted(txId)
        nonReentrant
    {
        Transaction storage transaction = transactions[txId];

        if (transaction.numApprovals < threshold) {
            revert InsufficientApprovals();
        }

        transaction.executed = true;

        (bool success, ) = transaction.to.call{value: transaction.value}(
            transaction.data
        );

        if (!success) revert TransactionExecutionFailed();

        emit TransactionExecuted(txId, msg.sender);
    }

    /*//////////////////////////////////////////////////////////////
                            VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Get all owners
     * @return Array of owner addresses
     */
    function getOwners() external view returns (address[] memory) {
        return owners;
    }

    /**
     * @notice Get total number of transactions
     * @return Number of transactions
     */
    function getTransactionCount() external view returns (uint256) {
        return transactions.length;
    }

    /**
     * @notice Get transaction details
     * @param txId Transaction ID
     * @return to Destination address
     * @return value ETH value
     * @return data Call data
     * @return executed Execution status
     * @return numApprovals Number of approvals
     */
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
    {
        Transaction storage transaction = transactions[txId];
        return (
            transaction.to,
            transaction.value,
            transaction.data,
            transaction.executed,
            transaction.numApprovals
        );
    }

    /**
     * @notice Check if an owner has approved a transaction
     * @param txId Transaction ID
     * @param owner Owner address
     * @return bool Approval status
     */
    function hasApproved(uint256 txId, address owner)
        external
        view
        returns (bool)
    {
        return approved[txId][owner];
    }

    /**
     * @notice Get all approvals for a transaction
     * @param txId Transaction ID
     * @return approvals Array of owner addresses that approved
     */
    function getApprovals(uint256 txId)
        external
        view
        returns (address[] memory approvals)
    {
        uint256 count = transactions[txId].numApprovals;
        approvals = new address[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < owners.length && index < count; i++) {
            if (approved[txId][owners[i]]) {
                approvals[index] = owners[i];
                index++;
            }
        }
    }
}
