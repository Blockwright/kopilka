// test/Reentrancy.test.ts — пост 17/20: после фикса грабитель разбивает нос о revert
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseEther } from "viem";

import { network } from "hardhat";

describe("Reentrancy fixed — атака откатывается", async function () {
  const { viem } = await network.create();
  const [deployer, victim] = await viem.getWalletClients();

  it("после фикса грабитель не может вынести чужое", async function () {
    const kopilka = await viem.deployContract("Kopilka", [parseEther("100")]);
    await kopilka.write.deposit({ value: parseEther("1"), account: victim.account });

    const robber = await viem.deployContract("Robber", [kopilka.address]);
    await assert.rejects(robber.write.attack({ value: parseEther("0.01") }));

    // 1 ETH жертвы на месте; взнос грабителя откатился вместе с его attack()
    const [current] = await kopilka.read.progress();
    assert.equal(current, parseEther("1"));
  });
});
