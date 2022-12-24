import { useEffect, useState } from "react";
import { useAccount, useBlockNumber, useContract, useContractRead, useSigner } from "wagmi";

import IERC721 from "../artifacts/@openzeppelin/contracts/token/ERC721/ERC721.sol/ERC721.json";
import web3, { nftTransferHistory } from "../dapp/alchemy";
import Moralis from "../dapp/molaris";
import NFTImage from "./NFTImage";

const BurnBtn = ({ collection, owner, tokenId }) => {
  const { data: signer } = useSigner();

  const contract = useContract({
    addressOrName: collection,
    contractInterface: IERC721.abi,
  });

  const handleBurn = () => {
    contract
      .connect(signer)
      ["safeTransferFrom(address,address,uint256)"](owner, process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, tokenId);
  };

  return (
    <button onClick={handleBurn} className="btn btn-primary btn-sm">
      Slowly burn 🔥
    </button>
  );
};

const MyNFT = () => {
  const { data } = useAccount();
  const [nfts, setNFT] = useState([]);
  const { data: blockNo } = useBlockNumber({
    watch: false,
    staleTime: 15000, // 15 sec
  });

  useEffect(() => {
    if (data) {
      Moralis.Web3API.account
        .getNFTs({
          chain: "mumbai",
          format: "decimal",
          limit: 10,
          address: data.address,
        })
        .then((data) => {
          setNFT(data.result);
        });
    }
  }, [data, blockNo]);

  return (
    <div className="my-8">
      <h2 className="mb-4 text-2xl">My collection</h2>
      <div className="grid grid-cols-5 gap-3">
        {nfts.map((item) => (
          <div key={`${item.token_address}_${item.token_id}`} className="shadow-xl card bg-base-100">
            <NFTImage collection={item.token_address} tokenId={item.token_id} />
            {/* <figure>
              <img src={item.token_uri} alt="Shoes" />
            </figure> */}
            <div className="p-3 card-body">
              <h2 className="card-title">Item #{item.token_id}</h2>
              {data && (
                <div className="justify-end card-actions">
                  <BurnBtn owner={data.address} collection={item.token_address} tokenId={item.token_id} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyNFT;
