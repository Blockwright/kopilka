# Sepolia Faucets

Everything in this series runs on **Sepolia** — Ethereum's main testnet. Test ETH is worthless by design: you can't buy it, sell it, or lose anything real. You get it for free from faucets, and you'll need some starting from the wallets post to deploy and poke at Kopilka.

> Checked working: August 2026. Faucets die and rate-limits change all the time — if one is down, just try the next. PRs with fresh links welcome.

## Where to get Sepolia ETH

| Faucet | Link | Requirements | Gives |
|---|---|---|---|
| pk910 PoW faucet | https://sepolia-faucet.pk910.de | none — your browser mines for it | up to ~2.5 ETH/day |
| Google Cloud Web3 | https://cloud.google.com/application/web3/faucet | Google account | ~0.05–0.1 ETH/day |
| Alchemy | https://sepoliafaucet.com | free account + tiny mainnet ETH balance | ~0.1–0.5 ETH/day |
| Chainlink | https://faucets.chain.link/sepolia | wallet connect | 0.1 ETH (+ test LINK) |
| QuickNode | https://faucet.quicknode.com/ethereum/sepolia | account / social verify | ~0.25 ETH/day |
| GetBlock | https://getblock.io/faucet | account + mainnet balance | ~0.1 ETH/day |
| testnet.help | https://testnet.help | captcha only | dust (last resort) |

## Which one should I use?

- **Fresh wallet, zero history?** Start with **pk910** — it asks for nothing and mines test ETH in your browser tab (a few minutes gets you plenty), or **Google Cloud** if you have a Google account.
- **Have ~$3 of real ETH on mainnet?** **Alchemy** and **QuickNode** are the fastest one-click options. The mainnet-balance check exists only to keep bots away.
- For this series you need **~0.5 Sepolia ETH** total. That covers every deploy, transaction and the intentional hack — with room to fat-finger things, which is the whole point of a testnet.

## Tips

- Use one address for the whole series — faucet limits are per-address per-day, and your transaction history will read like a diary of your progress.
- Test ETH has no price. Anyone selling it, or any "faucet" asking you to send something first, is a scam.
- Faucets drip slowly on purpose. Grab your ETH the day before you need it, not five minutes before.
