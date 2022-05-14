import { ethers } from "ethers";
import "dotenv/config";
import * as ballotJson from "../../artifacts/contracts/Ballot.sol/Ballot.json";


async function main() {
    const newWallet = ethers.Wallet.createRandom();
    console.log(newWallet);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
