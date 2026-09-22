// test/Reentrancy.test.ts — пост 16/20: уводим чужую копилку через реентрабельность
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseEther } from "viem";

import { network } from "hardhat";

describe("Reentrancy — как увести чужую копилку", async function () {
  const { viem } = await network.create();
  const publicClient = await viem.getPublicClient();
  const [deployer, alice] = await viem.getWalletClients();

  const balanceOf = (address: `0x${string}`) => publicClient.getBalance({ address });

  it("одна доля на входе — вся копилка на выходе", async function () {
    const kopilka = await viem.deployContract("KopilkaV2", [parseEther("10")]);

    // честная Алиса откладывает 5 ETH
    await kopilka.write.deposit({ value: parseEther("5"), account: alice.account });
    assert.equal(await balanceOf(kopilka.address), parseEther("5"));

    // грабитель заходит с одной долей в 1 ETH
    const robber = await viem.deployContract("Robber", [kopilka.address]);
    await robber.write.attack({ value: parseEther("1") });

    // копилка пуста, все 6 ETH осели у грабителя
    assert.equal(await balanceOf(kopilka.address), 0n);
    assert.equal(await balanceOf(robber.address), parseEther("6"));
  });
});
