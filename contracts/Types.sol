// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// Пост 6/20 — «Solidity глазами TS-разработчика: знакомое и коварное»
/// Полигон для поста: открой remix.ethereum.org, вставь файл, Deploy —
/// и потыкай функции. Деплоить в реальную сеть не нужно.
contract Types {
    // --- знакомое: почти TypeScript ---
    bool public locked;                      // boolean
    string public name = "Kopilka";          // string
    address public owner;                    // такого в TS нет, но смысл ясен
    uint256 public balance;                  // number? нет: целое до 2**256-1
    mapping(address => uint256) public deposits; // почти Map

    constructor() {
        owner = msg.sender;
    }

    // --- коварное №1: целочисленное деление ---
    // возвращает (6, 7) — порядок операций влияет на деньги
    function divisionOrder() external pure returns (uint256, uint256) {
        return (7 / 2 * 2, 7 * 2 / 2);
    }

    // Задание №6: комиссия 3% от amount = 250
    function feeWrong(uint256 amount) external pure returns (uint256) {
        return (amount / 100) * 3; // сначала делим — теряем остаток
    }

    function feeRight(uint256 amount) external pure returns (uint256) {
        return (amount * 3) / 100; // сначала умножаем
    }

    // --- коварное №2: нет undefined ---
    // deposits[любой адрес] == 0, а не undefined — проверь геттером deposits

    // --- коварное №3: переполнение = revert (Solidity 0.8+) ---
    function boom() external pure returns (uint8) {
        uint8 x = 255;
        x += 1; // транзакция откатится целиком
        return x;
    }

    // время — не Date, а секунды блока
    function now_() external view returns (uint256) {
        return block.timestamp;
    }
}
