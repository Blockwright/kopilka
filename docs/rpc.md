# Public RPC Endpoints

A node is your gateway to the chain: every read and every transaction in this series goes through JSON-RPC. You don't need to run your own node — public gateways below work without registration or API keys.

> Checked working: August 2026. Endpoints come and go — if one is slow or down, switch to the next. Full live lists: [chainlist.org](https://chainlist.org), [comparenodes.com](https://www.comparenodes.com/library/public-endpoints/ethereum/).

## Ethereum Mainnet

| Provider | Endpoint |
|---|---|
| PublicNode | `https://ethereum-rpc.publicnode.com` |
| dRPC | `https://eth.drpc.org` |
| 1RPC | `https://1rpc.io/eth` |
| LlamaNodes | `https://eth.llamarpc.com` |

## Sepolia (testnet — we live here)

| Provider | Endpoint |
|---|---|
| PublicNode | `https://ethereum-sepolia-rpc.publicnode.com` |
| dRPC | `https://sepolia.drpc.org` |
| 1RPC | `https://1rpc.io/sepolia` |

## Try it: your first JSON-RPC call

No libraries, just curl — ask the chain for its latest block number:

```bash
curl -s https://ethereum-rpc.publicnode.com \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

Response:

```json
{"jsonrpc":"2.0","id":1,"result":"0x163e8a5"}
```

`result` is the block height in hex. Convert it:

```bash
printf '%d\n' 0x163e8a5
```

Run the curl twice with ~12 seconds in between — the number grows. That's the append-only log being written, live, and you just read it with nothing but an HTTP request.

## Notes

- Public endpoints are rate-limited and give no guarantees — fine for learning, not for production. Real dApps use dedicated providers (Alchemy, Infura, dRPC paid tiers) or their own nodes.
- An RPC provider can't steal your funds (it never sees private keys), but it CAN lie to you or censor your transactions — that's why serious setups cross-check several providers. We'll touch this in the series.
- In code we use viem, which speaks JSON-RPC under the hood — the same `eth_blockNumber` you just curled.
