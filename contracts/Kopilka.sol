// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// Копилка v1 — пост 7/20 серии «Web3 для JS-разработчиков»
/// Класть могут все. Забрать — только владелец, и только когда цель достигнута.
contract Kopilka {
    address public owner;   // кто создал копилку
    uint256 public goal;    // цель накопления, в wei

    constructor(uint256 goal_) {
        owner = msg.sender;  // владелец = тот, кто задеплоил
        goal = goal_;
    }

    // payable = функция умеет принимать ETH вместе с вызовом
    function deposit() external payable {
        require(msg.value > 0, "empty deposit");
    }

    function withdraw() external {
        require(msg.sender == owner, "not the owner");
        require(address(this).balance >= goal, "goal not reached");

        (bool ok, ) = owner.call{value: address(this).balance}("");
        require(ok, "transfer failed");
    }

    function progress() external view returns (uint256 current, uint256 target) {
        return (address(this).balance, goal);
    }
}
