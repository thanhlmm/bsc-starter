import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import axios from 'axios';

const baseURL = `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMMY_KEY}`;


// Using HTTPS
const web3 = createAlchemyWeb3(
  baseURL,
);

export const nftTransferHistory = async (address: string) => {
  if (!address) {
    return []
  }

  // NOTE: The Transfers API is currently only available on Ethereum and Polygon. 
  // https://docs.alchemy.com/alchemy/enhanced-apis/transfers-api
  // It doesn works on TEST NET

  return await axios.get('https://api-testnet.bscscan.com/api', {
    params: {
      module: 'account',
      action: 'tokennfttx',
      address,
      page: 1,
      offset: 10,
      sort: 'desc',
      apikey: process.env.NEXT_PUBLIC_ETHERSCAN_API
    }
  }).then(response => response.data);
}

export default web3;
