// test/ReentrancyFixed.test.ts — пост 17/20: латка держит ту же атаку
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseEther, getAddress } from "viem";

import { network } from "hardhat";

describe("Reentrancy fixed — латка держит удар", async function () {
  const { viem } = await network.create();
  const publicClient = await viem.getPublicClient();
  const [deployer, alice] = await viem.getWalletClients();

  const balanceOf = (address: `0x${string}`) => publicClient.getBalance({ address });

  it("та же атака Robber, что в посте 16, теперь отбивается", async function () {
    const kopilka = await viem.deployContract("KopilkaSafe", [parseEther("10")]);
    await kopilka.write.deposit({ value: parseEther("5"), account: alice.account });

    const robber = await viem.deployContract("Robber", [kopilka.address]);

    // весь attack() откатывается — украсть не вышло
    await assert.rejects(robber.write.attack({ value: parseEther("1") }));

    // копилка нетронута: 5 ETH Алисы на месте
    assert.equal(await balanceOf(kopilka.address), parseEther("5"));
    assert.equal(
      await kopilka.read.deposits([getAddress(alice.account.address)]),
      parseEther("5"),
    );
  });

  it("честный вкладчик по-прежнему забирает своё", async function () {
    const kopilka = await viem.deployContract("KopilkaSafe", [parseEther("10")]);
    await kopilka.write.deposit({ value: parseEther("2"), account: alice.account });

    await viem.assertions.balancesHaveChanged(
      kopilka.write.refund({ account: alice.account }),
      [{ address: alice.account.address, amount: parseEther("2") }],
    );
    assert.equal(await balanceOf(kopilka.address), 0n);
  });
});
