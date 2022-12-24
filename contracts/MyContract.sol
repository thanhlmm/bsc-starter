//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";

// TODO: Pausable contract
// TODO: Fallback function to withdraw all NFT

contract MyContract is IERC721Receiver, KeeperCompatibleInterface {
	struct NFTOwner {
		address owner;
		address collection;
		uint256 tokenId;
		uint256 expiredBlock;
		bool burnable;
	}
	uint256 public constant EXPIRED_BLOCK_TIME = 391; // 15 mins. Polygon has BlockTime ~ 2.3s
	// uint256 public constant EXPIRED_BLOCK_TIME = 5; // 15 mins. Polygon has BlockTime ~ 2.3s
	address public owner;
	NFTOwner[] public nftList;
	uint256 lastIndexAccesable = 0; // Use this varible to save some compute time

	event NFTDestroy(
		address indexed _owner,
		address indexed _collection,
		uint256 _tokenId
	);

	constructor() public {
		owner = msg.sender;
	}

	function mineNFTs(address owner) public view returns (NFTOwner[] memory) {
		// 2 loops which is bad. https://stackoverflow.com/questions/60616895/solidity-returns-filtered-array-of-structs-without-push
		// But it's ok since this is view function
		uint256 resultCount;
		for (uint256 i = 0; i < nftList.length; i++) {
			if (nftList[i].owner == owner) {
				resultCount++;
			}
		}
		NFTOwner[] memory userNft = new NFTOwner[](resultCount);
		uint256 j;
		for (uint256 i = 0; i < nftList.length; i++) {
			if (nftList[i].owner == owner) {
				userNft[j] = nftList[i];
				j++;
			}
		}

		return userNft;
	}

	function getNFT(address collection, uint256 tokenId)
		public
		view
		returns (NFTOwner memory, uint256 index)
	{
		for (uint256 i = lastIndexAccesable; i < nftList.length; i++) {
			if (
				nftList[i].owner == msg.sender &&
				nftList[i].tokenId == tokenId &&
				nftList[i].collection == collection
			) {
				return (nftList[i], i);
			}
		}
		require(false, "No NFT");
	}

	function returnNFT(address collection, uint256 tokenId) public {
		(NFTOwner memory nft, uint256 index) = getNFT(collection, tokenId);
		require(nft.expiredBlock > block.number, "This NFT waiting to burn");
		require(nft.burnable, "This NFT is burned or returned");
		nft.burnable = false;
		nftList[index] = nft; // Store new instance
		IERC721 recipient = IERC721(collection);
		recipient.safeTransferFrom(address(this), msg.sender, tokenId);
	}

	function onERC721Received(
		address operator,
		address from,
		uint256 tokenId,
		bytes calldata data
	) external override returns (bytes4) {
		// TODO: What if someone else call this function? Do we need to double check with NFT contract?
		uint256 expireBlock = block.number + EXPIRED_BLOCK_TIME;
		NFTOwner memory nft = NFTOwner(
			from,
			msg.sender,
			tokenId,
			expireBlock,
			true
		);
		nftList.push(nft);

		return this.onERC721Received.selector;
	}

	function checkUpkeep(
		bytes calldata /* checkData */
	)
		external
		view
		override
		returns (
			bool upkeepNeeded,
			bytes memory /* performData */
		)
	{
		// This function run off-chain so we can put more logic here
		for (uint256 i = lastIndexAccesable; i < nftList.length; i++) {
			if (
				nftList[i].expiredBlock <= block.number && nftList[i].burnable
			) {
				return (true, abi.encode(block.number));
			}
		}
		return (false, abi.encode(0));
	}

	function performUpkeep(bytes calldata data) external override {
		// uint256 blockExec = abi.decode(data, (uint256));
		// require(blockExec < block.number, "Can only clean expired");
		// require(blockExec > 0, "No block to clean");
		for (uint256 i = lastIndexAccesable; i < nftList.length; i++) {
			if (nftList[i].burnable && nftList[i].expiredBlock < block.number) {
				nftList[i].burnable = false;
				lastIndexAccesable = i; // Save last time delete index
				ERC721Burnable recipient = ERC721Burnable(
					nftList[i].collection
				);
				emit NFTDestroy(
					nftList[i].owner,
					nftList[i].collection,
					nftList[i].tokenId
				);
				try recipient.burn(nftList[i].tokenId) {} catch (
					bytes memory /*lowLevelData*/
				) {
					// Auto assume above function always correct
					console.log("Error while burning NFT");
				}
			}
		}
	}
}
