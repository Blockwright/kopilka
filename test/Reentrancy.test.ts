// test/Reentrancy.test.ts — пост 16/20: грабитель выносит Копилку через reentrancy
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseEther } from "viem";

import { network } from "hardhat";

describe("Reentrancy — грабитель выносит Копилку", async function () {
  const { viem } = await network.create();
  const publicClient = await viem.getPublicClient();
  const [deployer, victim] = await viem.getWalletClients();

  it("один attack() выкачивает всю кассу", async function () {
    const kopilka = await viem.deployContract("Kopilka", [parseEther("100")]);
    await kopilka.write.deposit({ value: parseEther("5"), account: victim.account });

    const robber = await viem.deployContract("Robber", [kopilka.address]);
    await robber.write.attack({ value: parseEther("1") });

    const [current] = await kopilka.read.progress();
    assert.equal(current, 0n);
    assert.equal(await publicClient.getBalance({ address: robber.address }), parseEther("6"));
  });
});
