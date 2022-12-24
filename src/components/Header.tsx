import { chain, useConnect, useDisconnect } from "wagmi";

import Account from "./Account";
import Balance from "./Balance";

// import ChainId from "./ChainId";

export function Header() {
  const { reset, connect, activeConnector, connectors, error, isConnecting, pendingConnector } = useConnect({
    chainId: chain.polygonMumbai.id, // Only for testnet
  });
  const { disconnect } = useDisconnect();

  return (
    <div className="my-3 shadow-lg navbar bg-neutral text-neutral-content rounded-box">
      <div className="flex-1 px-2 mx-2">
        <span className="text-lg font-bold">
          {activeConnector ? "🟢 Connected" : error ? "🔴 Error" : "🟠 Connect your wallet using Polygon Testnet"}
        </span>
      </div>
      <div className="flex-none hidden px-2 mx-2 lg:flex">
        <div className="flex items-stretch">
          {/* <ChainId /> */}
          <Account />
          <Balance />
          {!activeConnector && (
            <button onClick={() => connect(connectors[0])} className="btn btn-primary btn-sm">
              Connect
            </button>
          )}
          {activeConnector && (
            <button type="button" className="btn btn-sm btn-secondary" onClick={() => disconnect()}>
              Log out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
