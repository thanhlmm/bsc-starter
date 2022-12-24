import dayjs from "dayjs";
import { useCallback, useMemo } from "react";
import { useAccount, useBlockNumber, useContract, useContractRead, useSigner } from "wagmi";

import BlackHoleABI from "../artifacts/contracts/NFTBlackHole.sol/NFTBlackHole.json";
import Countdown from "./Countdown";
import NFTImage from "./NFTImage";

const items = [1, 2, 3];

const BlackHole = () => {
  const { data: signer } = useSigner();
  const { data } = useAccount();
  const { data: blockNo } = useBlockNumber({ watch: false });
  const { data: mineNFTs } = useContractRead(
    {
      addressOrName: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      contractInterface: BlackHoleABI.abi,
    },
    "mineNFTs",
    {
      enabled: !!data,
      args: [data?.address],
      onError(error) {
        console.log("Error", error);
      },
      watch: true,
    }
  );

  const contract = useContract({
    addressOrName: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    contractInterface: BlackHoleABI.abi,
  });

  const returnNFT = (collection: string, tokenId: string | number) => {
    contract.connect(signer).returnNFT(collection, tokenId);
  };

  const getTime = useCallback((block, currentBlock) => {
    return dayjs().add((block - currentBlock) * 2.3, "second");
  }, []);

  // console.log({ blockNo: blockNo.valueOf() });

  const nfts = useMemo(() => {
    if (Array.isArray(mineNFTs)) {
      return mineNFTs
        .filter((item) => item.burnable)
        .map(({ burnable, collection, expiredBlock, owner, tokenId }) => ({
          owner,
          collection,
          tokenId,
          expiredBlock,
        }));
    }

    return [];
  }, [mineNFTs]);

  return (
    <div className="my-8">
      <h2 className="mb-4 text-2xl">Burning 🔥</h2>
      {nfts.length === 0 && (
        <div className="shadow-lg alert alert-warning">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0 w-6 h-6 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>Let burn some NFT</span>
          </div>
        </div>
      )}
      <div className="grid grid-cols-5 gap-3">
        {blockNo &&
          nfts.map((item) => (
            <div key={`${item.collection}_${item.tokenId.toNumber()}`} className="shadow-xl card bg-base-100">
              <NFTImage collection={item.collection} tokenId={item.tokenId.toString()} />
              <div className="p-3 card-body">
                <h2 className="card-title">Item #{item.tokenId.toNumber()}</h2>
                <Countdown date={getTime(item.expiredBlock, blockNo.valueOf())} />
                <div>until it get burned 🔥</div>
                <div className="justify-end card-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => returnNFT(item.collection, item.tokenId.toString())}
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default BlackHole;
