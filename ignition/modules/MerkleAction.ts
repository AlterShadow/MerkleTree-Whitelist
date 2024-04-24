import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import keccak256 from "keccak256";
import MerkleTree from "merkletreejs";
import hre from "hardhat";

function hashToken(address: string) {
  return Buffer.from(
    hre.ethers.solidityPackedKeccak256(["address"], [address]).slice(2),
    "hex"
  );
}

const MerkleActionModule = buildModule("MerkleActionModule", (m) => {
  const whitelist: string[] = [];

  let merkleTree = new MerkleTree(
    whitelist.map((addr) => hashToken(addr)),
    keccak256,
    { sortPairs: true }
  );

  const merkleAction = m.contract("MerkleAction", [merkleTree.getHexRoot()]);

  return { merkleAction };
});

export default MerkleActionModule;
