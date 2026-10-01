// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// Копилка v2.1 — пост 17/20: фикс реентрабельности перестановкой двух строк (CEI).
contract Kopilka {
    address public owner;
    uint256 public goal;
    mapping(address => uint256) public deposits;

    event Deposited(address indexed from, uint256 amount, uint256 total);
    event Withdrawn(address indexed to, uint256 amount);

    error EmptyDeposit();
    error NotOwner();
    error GoalNotReached(uint256 current, uint256 goal);
    error NothingToRefund();

    constructor(uint256 goal_) {
        owner = msg.sender;
        goal = goal_;
    }

    function deposit() external payable {
        if (msg.value == 0) revert EmptyDeposit();
        deposits[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value, address(this).balance);
    }

    /// Checks-Effects-Interactions: сначала записали, потом отдали.
    function refund() external {
        uint256 amount = deposits[msg.sender];
        if (amount == 0) revert NothingToRefund();

        deposits[msg.sender] = 0;                           // сначала записали
        (bool ok, ) = msg.sender.call{value: amount}("");  // потом отдали
        require(ok, "refund failed");
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
