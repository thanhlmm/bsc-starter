import { useMemo } from "react";
import { useContractRead } from "wagmi";

import ERC721 from "../artifacts/@openzeppelin/contracts/token/ERC721/ERC721.sol/ERC721.json";

const NFTImage = ({ collection, tokenId }) => {
  const { data: tokenURI } = useContractRead(
    {
      addressOrName: collection,
      contractInterface: ERC721.abi,
    },
    "tokenURI",
    {
      args: [tokenId],
      watch: false,
    }
  );

  const imgageLink = useMemo(() => {
    if (tokenURI) {
      const id = tokenURI.replace("ipfs://", "");
      return `https://${id}.ipfs.nftstorage.link/`;
    }

    return "";
  }, [tokenURI]);

  console.log(tokenURI);

  return (
    <figure>
      <img src={imgageLink} alt="Shoes" />
    </figure>
  );
};

export default NFTImage;
