// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// Копилка v2, залатанная — пост 17/20: чиним реентрабельность из поста 16.
/// Два слоя защиты:
///   1) порядок «проверки-эффекты-взаимодействия» (CEI): сначала меняем
///      состояние, отправка денег — последним действием;
///   2) мьютекс nonReentrant: запрет повторного входа, пока функция не вышла.
/// Второй слой — ровно то, что делает OpenZeppelin ReentrancyGuard.
/// Показываю руками, чтобы была видна механика.
contract KopilkaSafe {
    address public owner;
    uint256 public goal;
    mapping(address => uint256) public deposits;

    event Deposited(address indexed from, uint256 amount, uint256 total);
    event Refunded(address indexed to, uint256 amount);

    error EmptyDeposit();

    // 1 = открыто, 2 = занято. Числа вместо bool: переписать 1->2->1 дешевле
    // по газу, чем гонять false/true (так же сделано в OZ).
    uint256 private _lock = 1;

    modifier nonReentrant() {
        require(_lock == 1, "reentrant call");
        _lock = 2;
        _;
        _lock = 1;
    }

    constructor(uint256 goal_) {
        owner = msg.sender;
        goal = goal_;
    }

    function deposit() external payable {
        if (msg.value == 0) revert EmptyDeposit();
        deposits[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value, address(this).balance);
    }

    /// Тот же refund(), но порядок строк перевёрнут:
    /// сперва обнуляем запись, и только потом отправляем деньги.
    function refund() external nonReentrant {
        uint256 amount = deposits[msg.sender];
        require(amount > 0, "nothing to refund");

        deposits[msg.sender] = 0;                          // (1) эффект — СНАЧАЛА
        emit Refunded(msg.sender, amount);

        (bool ok, ) = msg.sender.call{value: amount}("");  // (2) отправка — ПОСЛЕДНЕЙ
        require(ok, "transfer failed");
    }
}
