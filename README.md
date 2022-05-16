# Project 1 - Encode Solidity May Cohort

## Setup
Create a `.env` file at the Project root with a wallet's private key.
``` .env
PRIVATE_KEY=<your private key>
```

## Deployment
`npm run deployment <proposals>`

Deploys the Ballot contract to the Ropsten test network. The wallet 

**Example**
`npm run deployment A B C D`

## Cast Vote
`npm run castVote <ballotContractAddress> <proposalIndex>`

Casts a vote for a proposal by the proposal index. The voter **needs** to have the right to vote (see [Give Voting Rights](https://github.com/sammeralomair/Encode-Solidity-Project-1#give-voting-rights "Give Voting Rights")).

## Give Voting Rights
`npm run giveVotingRights <ballotContractAddress> <walletAddressToGiveVotingRightsTo>`

Gives a wallet the right to vote.

## Delegate Voting Rights
`npm run delegateVote <ballotContractAddress> <walletAddressToDelegateVotingRightsTo>`

Gives another wallet the right to vote on your behalf. The delegating wallet must not have voted. The delegate wallet must have the right to vote.

## Query Proposals
`npm run queryProposals <ballotContractAddress>`

Displays all the proposals and their current vote count.

## Query The Winining Proposal
`npm run queryWinningProposal <ballotContractAddress>`

Display the winning proposal and it's current vote count.
