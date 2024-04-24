// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleAction {
    bytes32 public root;
    uint256 public counter;

    // The admin address
    address public admin;

    constructor(bytes32 merkleroot) {
        root = merkleroot;
        counter = 0;
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    function updateMerkleRoot(bytes32 _newMerkleRoot) external onlyAdmin {
        root = _newMerkleRoot;
    }

    function doAction(bytes32[] calldata proof) external {
        require(_verify(_leaf(msg.sender), proof), "Invalid merkle proof");
        counter++;
    }

    function _leaf(address _address) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_address));
    }

    function _verify(
        bytes32 leaf,
        bytes32[] memory proof
    ) internal view returns (bool) {
        return MerkleProof.verify(proof, root, leaf);
    }
}
