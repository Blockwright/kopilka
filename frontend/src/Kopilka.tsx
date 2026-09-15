// frontend/src/Kopilka.tsx — пост 14/20: запись из UI, два ожидания
import { useEffect } from "react";
import { formatEther, parseEther } from "viem";
import {
  useAccount,
  useBlockNumber,
  useConnect,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
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
  {
    type: "function",
    name: "deposit",
    stateMutability: "payable",
    inputs: [],
    outputs: [],
  },
] as const;

export function Kopilka() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  // чтение — пост 13
  const { data: progress, queryKey } = useReadContract({
    abi: kopilkaAbi,
    address: KOPILKA_ADDRESS,
    functionName: "progress",
  });

  // запись — пост 14: ожидание №1 (подпись) и №2 (блок)
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isMining, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // реактивность из поста 13: новый блок -> перечитать прогресс
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

  const deposit = () =>
    writeContract({
      abi: kopilkaAbi,
      address: KOPILKA_ADDRESS,
      functionName: "deposit",
      value: parseEther("0.01"),
    });

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

      <button onClick={deposit} disabled={isPending || isMining}>
        {isPending
          ? "Подпиши в кошельке…"
          : isMining
            ? "Транзакция в пути…"
            : "Закинуть 0.01 ETH"}
      </button>

      {isSuccess && <p>В блоке! Прогресс выше обновится сам.</p>}
      {error && <p>Не вышло: {error.name}</p>}

      <p>Блок №{blockNumber?.toString()} — страница обновляется сама</p>
    </main>
  );
}
