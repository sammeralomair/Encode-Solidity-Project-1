import { Contract } from "ethers";
import "dotenv/config";
import * as ballotJson from "../../artifacts/contracts/Ballot.sol/Ballot.json";
// eslint-disable-next-line node/no-missing-import
import { Ballot } from "../../typechain";
import { connectToWallet } from "../utils";

/**
 * > giveVotingRights <ballotContractAddress> <voterAddress>
 * 
 * Give voting rights to wallet address. 
 */
async function main() {
  // Get inputs
  if (process.argv.length < 3) throw new Error("Ballot address missing");
  const ballotAddress = process.argv[2];
  if (process.argv.length < 4) throw new Error("Voter address missing");
  const voterAddress = process.argv[3];
  
  // Connect to wallet
  const { wallet, signer } = await connectToWallet();

  // Connect to contract
  const ballotContract: Ballot = new Contract(
    ballotAddress,
    ballotJson.abi,
    signer
  ) as Ballot;

  // Process vote permissioning 
  const chairpersonAddress = await ballotContract.chairperson();
  if (chairpersonAddress !== wallet.address)
    throw new Error("Caller is not the chairperson for this contract");
  console.log(`Giving right to vote to ${voterAddress}`);
  const tx = await ballotContract.giveRightToVote(voterAddress);
  console.log("Awaiting confirmations");
  await tx.wait();
  console.log(`Transaction completed. Hash: ${tx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
