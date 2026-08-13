import { createWalletClient, createPublicClient, http, parseEther, formatEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';

const pk = process.env.SEPOLIA_PRIVATE_KEY;
if (!pk) {
  throw new Error(
    'SEPOLIA_PRIVATE_KEY не задан. Запуск: npx tsx --env-file=.env scripts/send.ts'
  );
}
const account = privateKeyToAccount(pk as `0x${string}`);

// урок поста 4: выбираем ноду сами. Дефолтная публичная у viem — под жёстким rate-limit
const RPC = process.env.SEPOLIA_RPC_URL ?? 'https://ethereum-sepolia-rpc.publicnode.com';

const publicClient = createPublicClient({ chain: sepolia, transport: http(RPC) });
const wallet = createWalletClient({ account, chain: sepolia, transport: http(RPC) });

const balance = await publicClient.getBalance({ address: account.address });
console.log('Баланс:', formatEther(balance), 'ETH');

const hash = await wallet.sendTransaction({
  to: account.address,
  value: parseEther('0.001'),
});
console.log('Отправлена:', hash);
console.log('Смотри: https://sepolia.etherscan.io/tx/' + hash);

const receipt = await publicClient.waitForTransactionReceipt({ hash });
console.log('В блоке:', receipt.blockNumber, '· статус:', receipt.status);
