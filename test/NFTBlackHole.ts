import { expect } from "chai";
import { ethers, network } from "hardhat";

describe('Receiver ERC721', async () => {
  let dumpNFT, nftBlackHole;
  let deployer, user;
  let tokenId1 = '0';
  let tokenId2 = '1';


  before(async () => {
    [deployer, user] = await ethers.getSigners();
    console.log('User address: ', user.address);

    const DumpNFT = await ethers.getContractFactory('DumpNFT');
    dumpNFT = await DumpNFT.connect(deployer).deploy();
    console.log("DumpNFT address: ", dumpNFT.address);

    const NFTBlackHole = await ethers.getContractFactory('NFTBlackHole');
    nftBlackHole = await NFTBlackHole.connect(deployer).deploy();
    console.log("NFTBlackHole contract address: ", nftBlackHole.address);
  });

  it('Send NFT to contract', async () => {
    await dumpNFT.connect(deployer).safeMint(user.address, "ipfs://bafkreiavtskjp5mvvcxzfvywivjkzm4rd3mp5athisnkxangw5ctzyiwaa");
    await dumpNFT.connect(deployer).safeMint(user.address, "ipfs://bafkreiavtskjp5mvvcxzfvywivjkzm4rd3mp5athisnkxangw5ctzyiwaa");

    await dumpNFT
      .connect(user)
      .functions['safeTransferFrom(address,address,uint256)'](
        user.address,
        nftBlackHole.address,
        tokenId1
      );

    await dumpNFT
      .connect(user)
      .functions['safeTransferFrom(address,address,uint256)'](
        user.address,
        nftBlackHole.address,
        tokenId2
      );

    const nftOwner1 = await dumpNFT.ownerOf(tokenId1)
    expect(nftOwner1).equal(nftBlackHole.address, "NFT now under contract control");
    const nftOwner2 = await dumpNFT.ownerOf(tokenId2)
    expect(nftOwner2).equal(nftBlackHole.address, "NFT now under contract control");
  });

  it('Withdrawlable after some few blocks', async () => {
    [deployer, user] = await ethers.getSigners();
    await network.provider.send("hardhat_mine", ["0x100"]); // Mine 256 block
    await nftBlackHole
      .connect(user)
      .returnNFT(dumpNFT.address, tokenId1);

    const nftOwner = await dumpNFT.ownerOf(tokenId1);
    expect(nftOwner).equal(user.address, "NFT now under user control");
  });

  it('Block withdrawl after 300 blocks', async () => {
    [deployer, user] = await ethers.getSigners();
    await network.provider.send("hardhat_mine", ["0x100"]); // Mine 256 block
    try {
      await nftBlackHole
        .connect(user)
        .returnNFT(dumpNFT.address, tokenId1);
    } catch (error) {
      expect(error.message).include("This NFT waiting to burn");
    }
  });

  it('Next run to burn NFT', async () => {
    const [shouldBurn] = await nftBlackHole
      .connect(user)
      .checkUpkeep(ethers.utils.solidityPack(["uint256"], [0]));

    expect(shouldBurn).equal(true);
  });

  it('Trigger burn NFT', async () => {
    [deployer, user] = await ethers.getSigners();
    try {
      await nftBlackHole
        .connect(user)
        .performUpkeep(ethers.utils.solidityPack(["uint256"], [518]));
    } catch (error) {
      expect(error.message).include("This NFT waiting to burn");
    }
  });

  it('Next run to ignore burn NFT call', async () => {
    await network.provider.send("hardhat_mine", ["0x100"]); // Mine 256 block
    const [shouldBurn] = await nftBlackHole
      .connect(user)
      .checkUpkeep(ethers.utils.solidityPack(["uint256"], [0]));

    expect(shouldBurn).equal(false);
  });
});