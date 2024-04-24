# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```


-Explanation
Create a smart contract with a single function, which is executed only for whitelisted users. What the function does is not important for the task — it could just write something simple to the contract state. What is important is that the whitelist should be implemented using the merkle tree: the contract should NOT store the list of whitelisted accounts, but instead should store only a merkle root hash for this list. Note whitelist may be huge (thousands of addresses).

Smart contract

Must have:
*function to add address to the whitelist. Available only for the admin. For simplicity, the admin address could be hardcoded. Ensure only a single address could be added with a single transaction and the previously added addresses could not be removed.
*target function. Available for whitelisted accounts only. Sender should pass inclusion proof in the message data proving that “sender” is in the whitelist. Contract should check this proof to allow the function execution (again, what the function does when the proof is valid is not important, can just change some state variable).

IMPORTANT:
the merkle tree code and inclusion proof client side code should be implemented by you, don’t use ready-made solutions.
