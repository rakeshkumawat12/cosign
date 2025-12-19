// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./MultisigWallet.sol";

/**
 * @title MultisigFactory
 * @author Cosign Protocol
 * @notice Factory contract for deploying and tracking MultisigWallet instances
 * @dev Emits events for frontend indexing and maintains creator-to-wallet mappings
 *
 * Features:
 * - Deterministic wallet deployment
 * - Creator-wallet relationship tracking
 * - Global wallet registry
 * - Gas-efficient storage patterns
 */
contract MultisigFactory {
    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event MultisigCreated(
        address indexed wallet,
        address indexed creator,
        address[] owners,
        uint256 threshold,
        uint256 timestamp
    );

    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/

    // Array of all created wallets
    address[] public allWallets;

    // Creator => wallet addresses
    mapping(address => address[]) public walletsByCreator;

    // Wallet => creator address
    mapping(address => address) public walletCreator;

    // Wallet => creation timestamp
    mapping(address => uint256) public walletCreatedAt;

    // Track if an address is a wallet created by this factory
    mapping(address => bool) public isWallet;

    /*//////////////////////////////////////////////////////////////
                          FACTORY FUNCTION
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Create a new multisig wallet
     * @param owners Array of owner addresses
     * @param threshold Number of required approvals
     * @return wallet Address of the created MultisigWallet
     */
    function createMultisig(address[] memory owners, uint256 threshold)
        external
        returns (address wallet)
    {
        // Deploy new MultisigWallet
        MultisigWallet multisig = new MultisigWallet(owners, threshold);
        wallet = address(multisig);

        // Register wallet
        allWallets.push(wallet);
        walletsByCreator[msg.sender].push(wallet);
        walletCreator[wallet] = msg.sender;
        walletCreatedAt[wallet] = block.timestamp;
        isWallet[wallet] = true;

        emit MultisigCreated(
            wallet,
            msg.sender,
            owners,
            threshold,
            block.timestamp
        );
    }

    /*//////////////////////////////////////////////////////////////
                            VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Get all wallets created by this factory
     * @return Array of wallet addresses
     */
    function getAllWallets() external view returns (address[] memory) {
        return allWallets;
    }

    /**
     * @notice Get wallets created by a specific address
     * @param creator Creator address
     * @return Array of wallet addresses
     */
    function getWalletsByCreator(address creator)
        external
        view
        returns (address[] memory)
    {
        return walletsByCreator[creator];
    }

    /**
     * @notice Get wallets where an address is an owner
     * @param owner Owner address to check
     * @return wallets Array of wallet addresses where owner is a signer
     * @dev This function iterates through all wallets and checks ownership
     *      Consider using subgraph for production to avoid gas limits
     */
    function getWalletsByOwner(address owner)
        external
        view
        returns (address[] memory wallets)
    {
        // First pass: count wallets where address is owner
        uint256 count = 0;
        for (uint256 i = 0; i < allWallets.length; i++) {
            if (MultisigWallet(payable(allWallets[i])).isOwner(owner)) {
                count++;
            }
        }

        // Second pass: populate array
        wallets = new address[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < allWallets.length; i++) {
            if (MultisigWallet(payable(allWallets[i])).isOwner(owner)) {
                wallets[index] = allWallets[i];
                index++;
            }
        }
    }

    /**
     * @notice Get total number of wallets created
     * @return Number of wallets
     */
    function getWalletCount() external view returns (uint256) {
        return allWallets.length;
    }

    /**
     * @notice Get detailed information about a wallet
     * @param wallet Wallet address
     * @return creator Address that created the wallet
     * @return createdAt Timestamp of creation
     * @return owners Array of owner addresses
     * @return threshold Required approval threshold
     */
    function getWalletInfo(address wallet)
        external
        view
        returns (
            address creator,
            uint256 createdAt,
            address[] memory owners,
            uint256 threshold
        )
    {
        require(isWallet[wallet], "Not a wallet created by this factory");

        MultisigWallet multisig = MultisigWallet(payable(wallet));

        creator = walletCreator[wallet];
        createdAt = walletCreatedAt[wallet];
        owners = multisig.getOwners();
        threshold = multisig.threshold();
    }
}
