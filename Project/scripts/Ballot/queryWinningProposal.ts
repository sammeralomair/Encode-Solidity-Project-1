import { Contract, ethers } from "ethers";
import "dotenv/config";
import * as ballotJson from "../../artifacts/contracts/Ballot.sol/Ballot.json";
// eslint-disable-next-line node/no-missing-import
import { Ballot } from "../../typechain";
import { connectToWallet } from "../utils";
  
/**
 * > queryWinningProposal <ballotContractAddress>
 * 
 * Displays the current winning proposal and the number of votes.
 */
async function main() {
  // Get inputs
  if (process.argv.length < 3) throw new Error("Ballot address missing");
  const ballotAddress = process.argv[2];
  
  // Connect to wallet
  const { signer } = await connectToWallet();

  // Connect to contract
  const ballotContract: Ballot = new Contract(
    ballotAddress,
    ballotJson.abi,
    signer
  ) as Ballot;
  
  // Get winning proposal
  const proposals = await ballotContract.getProposals();
  const winningIdx = await ballotContract.winningProposal();
  const winningProposal = proposals[winningIdx.toNumber()];

  const winnningVoteCount = winningProposal.voteCount.toString();
  const winnningVoteName = ethers.utils.parseBytes32String(winningProposal.name);

  console.log(`Proposal ${winnningVoteName} is winning with ${winnningVoteCount} votes`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
