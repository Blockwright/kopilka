// test/Kopilka.ts — пост 12/20: тесты Копилки (node:test + viem, Hardhat 3)
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseEther, getAddress } from "viem";

import { network } from "hardhat";

describe("Kopilka", async function () {
  const { viem } = await network.create();
  const [owner, stranger] = await viem.getWalletClients();

  const GOAL = parseEther("1");
  const deploy = () => viem.deployContract("Kopilka", [GOAL]);

  it("деплой: владелец — деплоер, цель записана, баланс нулевой", async function () {
    const kopilka = await deploy();

    assert.equal(await kopilka.read.owner(), getAddress(owner.account.address));
    const [current, target] = await kopilka.read.progress();
    assert.equal(current, 0n);
    assert.equal(target, GOAL);
  });

  it("deposit принимает деньги и эмитит Deposited", async function () {
    const kopilka = await deploy();

    await viem.assertions.emitWithArgs(
      kopilka.write.deposit({ value: parseEther("0.4"), account: stranger.account }),
      kopilka,
      "Deposited",
      [getAddress(stranger.account.address), parseEther("0.4"), parseEther("0.4")],
    );

    const [current] = await kopilka.read.progress();
    assert.equal(current, parseEther("0.4"));
  });

  it("deposit с нулевой суммой откатывается: EmptyDeposit", async function () {
    const kopilka = await deploy();

    await viem.assertions.revertWithCustomError(
      kopilka.write.deposit({ value: 0n }),
      kopilka,
      "EmptyDeposit",
    );
  });

  it("withdraw чужаком откатывается: NotOwner", async function () {
    const kopilka = await deploy();
    await kopilka.write.deposit({ value: GOAL });

    await viem.assertions.revertWithCustomError(
      kopilka.write.withdraw({ account: stranger.account }),
      kopilka,
      "NotOwner",
    );
  });

  it("withdraw до цели откатывается: GoalNotReached с цифрами", async function () {
    const kopilka = await deploy();
    await kopilka.write.deposit({ value: parseEther("0.3") });

    await viem.assertions.revertWithCustomErrorWithArgs(
      kopilka.write.withdraw(),
      kopilka,
      "GoalNotReached",
      [parseEther("0.3"), GOAL],
    );
  });

  it("после цели владелец забирает всё до копейки", async function () {
    const kopilka = await deploy();
    await kopilka.write.deposit({ value: GOAL, account: stranger.account });

    await viem.assertions.balancesHaveChanged(kopilka.write.withdraw(), [
      { address: owner.account.address, amount: GOAL },
    ]);

    const [current] = await kopilka.read.progress();
    assert.equal(current, 0n);
  });

  it("withdraw эмитит Withdrawn с суммой", async function () {
    const kopilka = await deploy();
    await kopilka.write.deposit({ value: GOAL, account: stranger.account });

    await viem.assertions.emitWithArgs(
      kopilka.write.withdraw(),
      kopilka,
      "Withdrawn",
      [getAddress(owner.account.address), GOAL],
    );
  });
});