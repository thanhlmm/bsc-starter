import { useState } from "react";
import { useAccount, useContract, useSigner } from "wagmi";

import DumpNFT from "../artifacts/contracts/DumpNFT.sol/DumpNFT.json";
import BlackHole from "./BlackHole";
import { Header } from "./Header";
import MyNFT from "./MyNFT";
import RecentBoughtNFT from "./RecentBoughtNFT";

export default function Demo() {
  const [address, setAddress] = useState("");
  const { data: signer } = useSigner();
  const { data: account } = useAccount();

  const contract = useContract({
    addressOrName: "0x70455bA5953A5Af8346329F15e6602e6f181EA90", // Remove hard code
    contractInterface: DumpNFT.abi,
  });

  const handleMint = () => {
    const ipfsLink = [
      "ipfs://bafkreiavtskjp5mvvcxzfvywivjkzm4rd3mp5athisnkxangw5ctzyiwaa",
      "ipfs://bafkreiaft6wptryxsj5r24xpqph4hjfn6dsded7663woj55fljsemg3beu",
      "ipfs://bafkreid77dvqoqpicaze4y5n45emfyrt7lxmopptzbpyaspz5o3tzdhuha",
    ].sort(function () {
      return 0.5 - Math.random();
    });

    contract.connect(signer).safeMint(account.address, ipfsLink[0]);
  };
  return (
    <>
      <Header />

      <div className="flex items-center justify-center my-8">
        <div className="w-1/2 max-w-xs form-control">
          <label className="label">
            <span className="label-text">Your wallet address</span>
            <span
              className="text-blue-700 underline label-text-alt hover:cursor-pointer"
              onClick={() => setAddress("0x31e28829cfb9924aE48bAc476Ea8102985aAAB3e")}
            >
              Try Example
            </span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full max-w-xs input input-bordered"
          />
        </div>
      </div>
      <div className="flex items-center justify-center my-8">
        {account && (
          <button className="btn btn-primary" onClick={() => handleMint()}>
            Mint me a NFT
          </button>
        )}
      </div>
      <RecentBoughtNFT address={address} />
      <MyNFT />
      <BlackHole />
    </>
  );
}
