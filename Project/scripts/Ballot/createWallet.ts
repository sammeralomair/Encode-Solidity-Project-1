import { ethers } from "ethers";
import "dotenv/config";
import * as ballotJson from "../../artifacts/contracts/Ballot.sol/Ballot.json";
import { SigningKey } from "ethers/lib/utils";


async function main() {
    const newWallet = ethers.Wallet.createRandom();
    console.log(newWallet);
    console.log(newWallet.mnemonic);
    console.log(newWallet.privateKey);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});