import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import { MerkleAction as MerkleActionType } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

function hashToken(address: string) {
  return Buffer.from(
    hre.ethers.solidityPackedKeccak256(["address"], [address]).slice(2),
    "hex"
  );
}

describe("MerkleAction", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.

  let _owner;
  let whitelist: Array<HardhatEthersSigner> = [];
  let _noWhitelistAccount: HardhatEthersSigner;

  let merkleTree: MerkleTree;

  let MerkleAction, merkleAction: MerkleActionType;

  beforeEach(async function () {
    const [owner, account1, account2, account3, noWhitelistAccount] =
      await hre.ethers.getSigners();
    (_owner = owner), (_noWhitelistAccount = noWhitelistAccount);

    whitelist.push(account1);
    whitelist.push(account2);
    whitelist.push(account3);

    merkleTree = new MerkleTree(
      whitelist.map((addr) => hashToken(addr.address)),
      keccak256,
      { sortPairs: true }
    );

    MerkleAction = await hre.ethers.getContractFactory("MerkleAction");
    merkleAction = await MerkleAction.deploy(merkleTree.getHexRoot());

    console.log("Deployed to: ", await merkleAction.getAddress());
  });

  describe("Deployment", function () {
    it("Should do action by any account in whitelist", async function () {
      let prevCounter = await merkleAction.counter();
      const proof = merkleTree.getHexProof(hashToken(whitelist[0].address));
      await merkleAction.connect(whitelist[0]).doAction(proof);

      let afterCounter = await merkleAction.counter();

      expect(prevCounter + BigInt(1) == afterCounter).to.be.true;
    });

    it("Should not do action by any account not in whitelist", async function () {
      const proof = merkleTree.getHexProof(
        hashToken(_noWhitelistAccount.address)
      );
      await expect(
        merkleAction.connect(_noWhitelistAccount).doAction(proof)
      ).to.be.revertedWith("Invalid merkle proof");
    });
  });
});
