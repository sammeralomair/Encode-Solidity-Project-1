import { Contract } from "ethers";
import "dotenv/config";
import * as ballotJson from "../../artifacts/contracts/Ballot.sol/Ballot.json";
// eslint-disable-next-line node/no-missing-import
import { Ballot } from "../../typechain";
import { connectToWallet } from "../utils";

/** 
 * > castVote <ballotContractAddress> <proposalIndex>
 * 
 * Casts a vote on behalf of the enviromnment's wallet.
 *  */
async function main() {
  // Get inputs
  if (process.argv.length < 3) throw new Error("Ballot address missing");
  const ballotAddress = process.argv[2];
  if (process.argv.length < 4) throw new Error("Proposal Index missing");
  const proposalIndexStr = process.argv[3];
  const proposalIndex = parseInt(proposalIndexStr);

  // Connect to wallet
  const { wallet, signer } = await connectToWallet();

  // Connect to contract
  const ballotContract: Ballot = new Contract(
    ballotAddress,
    ballotJson.abi,
    signer
  ) as Ballot;

  // Process vote
  console.log(`Processing vote=${proposalIndex} for wallet=${wallet.address} on ballotAddress=${ballotAddress}`);
  const proposals = await ballotContract.getProposals();
  if (proposalIndex < 0 || proposalIndex >= proposals.length) {
    throw new Error(`Proposal index (${proposalIndex}) is out of bounds`);
  }

  const tx = await ballotContract.vote(proposalIndex);
  await tx.wait();
  console.log(`Transaction completed. Hash: ${tx.hash}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
