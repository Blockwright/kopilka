// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// Пост 9/20 — «Storage packing: порядок полей экономит реальные деньги»
/// Одинаковые данные, одинаковые типы — разный порядок объявления.
/// Замер (solc 0.8.36, оптимизатор): первая запись 88 120 vs 66 290 газа.

contract PiggyRecordBad {
    // ┌─ слот 0: createdAt (8 байт, 24 простаивают)
    // ├─ слот 1: total (32 байта)
    // └─ слот 2: depositsCount (8 байт, 24 простаивают)
    uint64  public createdAt;
    uint256 public total;
    uint64  public depositsCount;

    function record(uint256 amount) external {
        createdAt = uint64(block.timestamp);
        total += amount;
        depositsCount += 1;
    }
}

contract PiggyRecordGood {
    // ┌─ слот 0: total (32 байта)
    // └─ слот 1: createdAt + depositsCount (8 + 8, соседи)
    uint256 public total;
    uint64  public createdAt;
    uint64  public depositsCount;

    function record(uint256 amount) external {
        createdAt = uint64(block.timestamp);
        total += amount;
        depositsCount += 1;
    }
}
