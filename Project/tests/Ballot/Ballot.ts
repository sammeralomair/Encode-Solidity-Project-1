import { expect } from "chai";
import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import { Ballot } from "../../typechain";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function giveRightToVote(ballotContract: Ballot, voterAddress: any) {
  const tx = await ballotContract.giveRightToVote(voterAddress);
  await tx.wait();
}

describe("Ballot", function () {
  let ballotContract: Ballot;
  let accounts: any[];

  this.beforeEach(async function () {
    accounts = await ethers.getSigners();
    const ballotFactory = await ethers.getContractFactory("Ballot");
    ballotContract = await ballotFactory.deploy(
      convertStringArrayToBytes32(PROPOSALS)
    );
    await ballotContract.deployed();
  });

  describe("when the contract is deployed", function () {
    it("has the provided proposals", async function () {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(ethers.utils.parseBytes32String(proposal.name)).to.eq(
          PROPOSALS[index]
        );
      }
    });

    it("has zero votes for all proposals", async function () {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(proposal.voteCount.toNumber()).to.eq(0);
      }
    });

    it("sets the deployer address as chairperson", async function () {
      const chairperson = await ballotContract.chairperson();
      expect(chairperson).to.eq(accounts[0].address);
    });

    it("sets the voting weight for the chairperson as 1", async function () {
      const chairpersonVoter = await ballotContract.voters(accounts[0].address);
      expect(chairpersonVoter.weight.toNumber()).to.eq(1);
    });
  });

  describe("when the chairperson interacts with the giveRightToVote function in the contract", function () {
    it("gives right to vote for another address", async function () {
      const voterAddress = accounts[1].address;
      await giveRightToVote(ballotContract, voterAddress);
      const voter = await ballotContract.voters(voterAddress);
      expect(voter.weight.toNumber()).to.eq(1);
    });

    it("can not give right to vote for someone that has voted", async function () {
      const voterAddress = accounts[1].address;
      await giveRightToVote(ballotContract, voterAddress);
      await ballotContract.connect(accounts[1]).vote(0);
      await expect(
        giveRightToVote(ballotContract, voterAddress)
      ).to.be.revertedWith("The voter already voted.");
    });

    it("can not give right to vote for someone that has already voting rights", async function () {
      const voterAddress = accounts[1].address;
      await giveRightToVote(ballotContract, voterAddress);
      await expect(
        giveRightToVote(ballotContract, voterAddress)
      ).to.be.revertedWith("");
    });
  });

  describe("when the voter interact with the vote function in the contract", function () {
    // TODO
    it("proposal vote count increments by voter's vote weight on successful vote", async function () {
      const voterAddress = accounts[1].address;
      const voter = await ballotContract.voters(voterAddress);
      await giveRightToVote(ballotContract, voterAddress);
      const voterWeight = voter.weight.toNumber()
      await ballotContract.connect(accounts[1]).vote(0);
      expect(ballotContract.proposals[0].voteCount.toNumber()).to.eq(voterWeight);
    });

    it ("If the voter has voted, the vote function will fail", async function () {
      const voterAddress = accounts[1].address;
      await giveRightToVote(ballotContract, voterAddress);
      await ballotContract.connect(accounts[1]).vote(0);
      await expect(
        giveRightToVote(ballotContract, voterAddress)
      ).to.be.revertedWith("The voter already voted.");
    });
  });

  describe("when the voter interact with the delegate function in the contract", function () {
    // TODO

    it ("If delegate already voted, don't increment weight but increment vote count directly", async function () {
      const voterAddress = accounts[1].address;
      const delegateAddress = accounts[2].address;
      await giveRightToVote(ballotContract, voterAddress);
      await giveRightToVote(ballotContract, delegateAddress);
      // delegate votes
      await ballotContract.connect(accounts[2]).vote(0);
      // delgate is delegated
      await ballotContract.connect(accounts[1]).delegate(delegateAddress);
      const delegate = await ballotContract.voters(delegateAddress); 
      const voter = await ballotContract.voters(voterAddress); 
      // delegate weight still 0 but vote count increases
      await expect(delegate.weight.toNumber()).to.eq(0);
      await expect(voter.weight.toNumber()).to.eq(0);
      await expect(ballotContract.proposals[0].voteCount.toNumber()).to.eq(2);
    });

    it("if delegate hasn't voted yet", async function () {
      const voterAddress = accounts[1].address;
      const delegateAddress = accounts[2].address;
      await giveRightToVote(ballotContract, voterAddress);
      await giveRightToVote(ballotContract, delegateAddress);
      const delegate = await ballotContract.voters(delegateAddress); 
      const voter = await ballotContract.voters(voterAddress); 
      await ballotContract.connect(accounts[1]).delegate(delegateAddress);
      expect(delegate.weight.toNumber()).to.eq(2);
      expect(voter.weight.toNumber()).to.eq(0);
    });
  });

  describe("when the an attacker interact with the giveRightToVote function in the contract", function () {
    // TODO
    it("is not implemented", async function () {
      throw new Error("Not implemented");
    });
  });

  describe("when the an attacker interact with the vote function in the contract", function () {
    // TODO
    it("is not implemented", async function () {
      throw new Error("Not implemented");
    });
  });

  describe("when the an attacker interact with the delegate function in the contract", function () {
    // TODO
    it("is not implemented", async function () {
      throw new Error("Not implemented");
    });
  });

  describe("when someone interact with the winningProposal function before any votes are cast", function () {
    // TODO
    it("if no votes are cast yet, it'll output the last proposal", async function () {
      const winningProposal = await ballotContract.connect(accounts[1]).winningProposal();
      expect(winningProposal).to.eq(ballotContract.proposals[ballotContract.proposals.length - 1])
    });
  });

  describe("when someone interact with the winningProposal function after one vote is cast for the first proposal", function () {
    // TODO
    it("it'll output the first proposal because it has most votes", async function () {
      const voterAddress = accounts[1].address;
      await giveRightToVote(ballotContract, voterAddress);
      await ballotContract.connect(accounts[1]).vote(0);
      const winningProposal = await ballotContract.connect(accounts[1]).winningProposal();
      expect(winningProposal).to.eq(ballotContract.proposals[0])
    });
  });

  describe("when someone interact with the winnerName function before any votes are cast", function () {
    // TODO
    it("if no votes are cast yet, it'll output the name of the last proposal", async function () {
      const winningName = await ballotContract.connect(accounts[1]).winningName().toString();
      expect(winningName).to.eq(ballotContract.proposals[ballotContract.proposals.length - 1].name.toString())
    });
  });

  describe("when someone interact with the winnerName function after one vote is cast for the first proposal", function () {
    // TODO
    it("it'll output the name of the first proposal", async function () {
      const voterAddress = accounts[1].address;
      await giveRightToVote(ballotContract, voterAddress);
      await ballotContract.connect(accounts[1]).vote(0);
      const winningName = await ballotContract.connect(accounts[1]).winningName().toString();
      expect(winningName).to.eq(ballotContract.proposals[0].name.toString())
    });
  });

  describe("when someone interact with the winningProposal function and winnerName after 5 random votes are cast for the proposals", function () {
    // TODO
    it("will output proposal with highest votes, or the latest if there's a tie", async function () {
      const voterAddress = accounts[1].address;
      await giveRightToVote(ballotContract, voterAddress);
      // do random number picker from proposal indices 5 times and vote each time 
      await ballotContract.connect(accounts[1]).vote(0);
      const winningProposal = await ballotContract.connect(accounts[1]).winningProposal();
      expect(winningProposal).to.eq(ballotContract.proposals[0])
    });

    it("will output the proposal name with highest votes, or the latest if there's a tie", async function () {
      const voterAddress = accounts[1].address;
      await giveRightToVote(ballotContract, voterAddress);
      // do random number picker from proposal indices 5 times and vote each time 
      await ballotContract.connect(accounts[1]).vote(0);
      const winningName = await ballotContract.connect(accounts[1]).winningName().toString();
      expect(winningName).to.eq(ballotContract.proposals[0].name.toString())
    });
  });
});
