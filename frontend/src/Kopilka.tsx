// frontend/src/Kopilka.tsx — пост 13/20: кошелёк + живой прогресс
import { useEffect } from "react";
import { formatEther } from "viem";
import {
  useAccount,
  useBlockNumber,
  useConnect,
  useReadContract,
} from "wagmi";
import { useQueryClient } from "@tanstack/react-query";

// адрес из `npx hardhat ignition deploy` (пост 11)
const KOPILKA_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3" as const;

const kopilkaAbi = [
  {
    type: "function",
    name: "progress",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "current", type: "uint256" },
      { name: "target", type: "uint256" },
    ],
  },
] as const;

export function Kopilka() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  const { data: progress, queryKey } = useReadContract({
    abi: kopilkaAbi,
    address: KOPILKA_ADDRESS,
    functionName: "progress",
  });

  // реактивность: новый блок -> перечитать контракт
  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [blockNumber, queryClient, queryKey]);

  if (!isConnected) {
    return (
      <button onClick={() => connect({ connector: connectors[0] })}>
        Подключить кошелёк
      </button>
    );
  }

  const [current, target] = progress ?? [0n, 0n];

  return (
    <main>
      <p>Ты: {address}</p>
      <h1>
        Накоплено {formatEther(current)} из {formatEther(target)} ETH
      </h1>
      <progress
        value={Number(formatEther(current))}
        max={Number(formatEther(target)) || 1}
      />
      <p>Блок №{blockNumber?.toString()} — страница обновляется сама</p>
    </main>
  );
}
