// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// Копилка v1.1 — пост 10/20: события и custom errors
/// Класть могут все. Забрать — только владелец, и только когда цель достигнута.
/// v1 (без событий) — в теге post-07.
contract Kopilka {
    address public owner;   // кто создал копилку
    uint256 public goal;    // цель накопления, в wei

    // события: дешёвые логи для фронтенда и индексаторов
    event Deposited(address indexed from, uint256 amount, uint256 total);
    event Withdrawn(address indexed to, uint256 amount);

    // custom errors: структурированные ошибки вместо строк (с 0.8.4)
    error EmptyDeposit();
    error NotOwner();
    error GoalNotReached(uint256 current, uint256 goal);

    constructor(uint256 goal_) {
        owner = msg.sender;
        goal = goal_;
    }

    function deposit() external payable {
        if (msg.value == 0) revert EmptyDeposit();
        emit Deposited(msg.sender, msg.value, address(this).balance);
    }

    function withdraw() external {
        if (msg.sender != owner) revert NotOwner();
        uint256 bal = address(this).balance;
        if (bal < goal) revert GoalNotReached(bal, goal);

        (bool ok, ) = owner.call{value: bal}("");
        require(ok, "transfer failed");
        emit Withdrawn(owner, bal);
    }

    function progress() external view returns (uint256 current, uint256 target) {
        return (address(this).balance, goal);
    }
}
