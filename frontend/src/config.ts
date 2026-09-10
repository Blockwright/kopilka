// frontend/src/config.ts — пост 13/20: сети и кошелёк
import { createConfig, http } from "wagmi";
import { hardhat, sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const config = createConfig({
  chains: [hardhat, sepolia],
  connectors: [injected()],
  transports: {
    [hardhat.id]: http(),   // http://127.0.0.1:8545 по умолчанию
    [sepolia.id]: http(),   // публичная нода; для прода — свой RPC (пост 4!)
  },
});
