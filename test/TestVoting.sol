pragma solidity ^0.4.17;
//
import "truffle/Assert.sol";

//fresh instance of a contract being deployed to the BC
//avoids overwriting or wasting space
import "truffle/DeployedAddresses.sol";

//contract import
import "../contracts/Voting.sol";

//test the voting .sol contract
contract TestVoting{

//instantiating a test contract
Voting voting = Voting(DeployedAddresses.Voting());


//Trev testing constructor issue
	bytes32 public assignedCandidate;

	bytes32[5] public newList;
//dale's attemt to force values into the array
	/*bytes32[0] = "test1";
		bytes32[1] = "test2";
			bytes32[2] = "test3";
				bytes32[3] = "test4";
					bytes32[4] = "test5";
						bytes32[5] = "test6";
		*/
		
	voting.getCandidateNames(newList);

	
	function testGetCandidateNames() public {
	
	assignedCandidate= voting.candidateList(1);
	bytes32 originalCanddate = newList[1];

	Assert.equal(assignedCandidate,originalCanddate,"Failed, Candidate list not assigned.");
	}



//Below function tests both voting and retrieivng the vote count

	function testVoteForCandidate() public {
	voting.voteForCandidate(assignedCandidate);
	uint startValue = voting.totalVotesFor(assignedCandidate);
	voting.voteForCandidate(assignedCandidate);
	uint endValue = voting.totalVotesFor(assignedCandidate);

	Assert.isAbove(endValue,startValue, "Failed. Did not increment.");
	}

//Below function tests retreiving array vote count of ALL candidates

	function testGetAllCandVotes() public {
	voting.totalVotesForAll();
	uint voteCountFromList = voting.candidatesVotes(1);
	uint voteCountFromFunction = voting.totalVotesFor(assignedCandidate);

	Assert.equal(voteCountFromList,voteCountFromFunction,"Failed.");
	}



}


