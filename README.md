# Kopilka

> *Kopilka (копилка) is Russian for "piggy bank" — a savings box you can't open without breaking it. Ours you can't break at all.*

An **on-chain piggy bank** — the teaching dApp built live, post by post, throughout the **"Web3 for JS developers"** series. A savings vault smart contract plus a React frontend, written from scratch in public.

**The series (in Russian):** Telegram → [t.me/blockwright_dev](https://t.me/blockwright_dev) · **Author:** [blockwright.eth](https://app.ens.domains/blockwright.eth)

## How this repo works

Code lands here as the series progresses — two posts a week. Every post that touches code gets a **git tag** (`post-05`, `post-07`, …), so you can check out the exact state of the project at any point in the series:

```bash
git checkout post-07   # the very first version of the Kopilka contract
```

If you're reading a post and the code on `main` looks ahead of it — that's why. Use the tag.

## What gets built

| Stage | What | Series posts |
|---|---|---|
| v0 | First transaction from a script (viem + TypeScript) | 5 |
| v1 | Kopilka contract: `deposit` / `withdraw`, events, custom errors | 7–10 |
| v1 | Tests (edge cases included — in web3 a bug means lost money) | 11–12 |
| v1 | React frontend: wallet connect, read & write, tx UX | 13–14 |
| v1 | Testnet deploy + contract verification, live demo | 15 |
| — | We attack our own contract (reentrancy) — then fix it | 16 |
| v2 | Multi-user piggy banks, savings goals | 17 |
| v2 | ERC-20 deposits | 18 |

## Stack

Solidity · Foundry · TypeScript · viem · React · wagmi

## Disclaimer

This is **educational code**. It is intentionally built step by step, including versions with known vulnerabilities (we break them on purpose later in the series). It is not audited. Do not put real money into it — testnet only.

---

*Built in public. Season 1 in progress.*
