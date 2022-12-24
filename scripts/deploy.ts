// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { parseUnits } from "@ethersproject/units";
import hre from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const MyContract = await hre.ethers.getContractFactory("MyContract");
  const contract = await MyContract.deploy(); // BUSD
  await contract.deployed();
  console.log("Contract deployed to:", contract.address);

  // TODO: Only deploy NFT on testnet
  // const DumpNFT = await hre.ethers.getContractFactory("DumpNFT");
  // const dumpNFT = await DumpNFT.deploy();
  // await dumpNFT.deployed();
  // console.log("DumpNFT deployed to:", dumpNFT.address);

  // await dumpNFT.safeMint(process.env.PUBLIC_KEY, "ipfs://bafkreiavtskjp5mvvcxzfvywivjkzm4rd3mp5athisnkxangw5ctzyiwaa");
  // await dumpNFT.safeMint(process.env.PUBLIC_KEY, "ipfs://bafkreiaft6wptryxsj5r24xpqph4hjfn6dsded7663woj55fljsemg3beu");
  // await dumpNFT.safeMint(process.env.PUBLIC_KEY, "ipfs://bafkreid77dvqoqpicaze4y5n45emfyrt7lxmopptzbpyaspz5o3tzdhuha");

  // console.log("Done create 3 dump NFT");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
