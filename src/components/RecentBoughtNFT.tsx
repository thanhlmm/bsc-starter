import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useAccount, useBlockNumber, useContract, useContractRead, useSigner } from "wagmi";

import IERC721 from "../artifacts/@openzeppelin/contracts/token/ERC721/IERC721.sol/IERC721.json";
import web3, { nftTransferHistory } from "../dapp/alchemy";
import Moralis from "../dapp/molaris";
import NFTImage from "./NFTImage";

const RecentBoughtNFT = ({ address }) => {
  // const { data } = useAccount();
  const [nfts, setNFT] = useState([]);
  const { data: blockNo } = useBlockNumber();

  useEffect(() => {
    if (address) {
      Moralis.Web3API.account
        .getNFTTransfers({
          chain: "mumbai",
          format: "decimal",
          direction: "to",
          limit: 10,
          address,
        })
        .then((data) => {
          console.log(data);
          setNFT(data.result);
        })
        .then((result) => {
          // console.log(result);
          // setNFT(result);
        });
    }
  }, [address, blockNo]);

  return (
    <div className="my-8">
      <h2 className="mb-4 text-2xl">Recent Bought NFT</h2>
      <div className="grid grid-cols-5 gap-3">
        {nfts.map((item) => (
          <div key={item.token_id} className="shadow-xl card bg-base-100">
            <NFTImage collection={item.token_address} tokenId={item.token_id} />
            <div className="p-3 card-body">
              <h2 className="card-title">Item #{item.token_id}</h2>
              <p>Bought at {dayjs(item.block_timestamp).format("DD/MM/YYYY HH:mm:ss")}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentBoughtNFT;
