import { useWeb3React } from "@web3-react/core";

// Ref: https://chainlist.org/
const chainIdMapping = {
  45: "BSC-Mainnet",
  97: "BSC-Testnet",
};

export function ChainId() {
  const { chainId } = useWeb3React();
  if (!chainId) {
    return null;
  }

  return (
    <div className="btn btn-ghost btn-sm rounded-btn">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 mr-2 hover:text-blue-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
      <span>{chainIdMapping[chainId] || chainId}</span>
    </div>
  );
}

export default ChainId;
