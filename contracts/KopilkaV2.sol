// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// Копилка v2 — пост 16/20: добавили refund() и вместе с ним — дыру
/// Теперь копилка помнит, кто сколько внёс, и позволяет забрать своё назад.
/// ВНИМАНИЕ: этот refund() уязвим к реентрабельности. Мы ломаем его в этом же
/// посте. Это учебный контракт с известной дырой — не деплой с деньгами.
contract KopilkaV2 {
    address public owner;
    uint256 public goal;
    mapping(address => uint256) public deposits; // кто сколько внёс

    event Deposited(address indexed from, uint256 amount, uint256 total);
    event Refunded(address indexed to, uint256 amount);

    error EmptyDeposit();

    constructor(uint256 goal_) {
        owner = msg.sender;
        goal = goal_;
    }

    function deposit() external payable {
        if (msg.value == 0) revert EmptyDeposit();
        deposits[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value, address(this).balance);
    }

    /// Уязвимо: сначала ОТПРАВЛЯЕМ деньги, и только потом обнуляем запись.
    /// Между строкой (1) и строкой (2) контракт-получатель успевает снова
    /// войти в refund() — а его баланс всё ещё не обнулён.
    function refund() external {
        uint256 amount = deposits[msg.sender];
        require(amount > 0, "nothing to refund");

        (bool ok, ) = msg.sender.call{value: amount}(""); // (1) внешний вызов
        require(ok, "transfer failed");

        deposits[msg.sender] = 0;                          // (2) слишком поздно
        emit Refunded(msg.sender, amount);
    }
}
