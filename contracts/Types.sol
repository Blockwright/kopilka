contract Kopilka {
    bool public locked;          // boolean
    string public name;          // string
    address public owner;        // такого в TS нет, но смысл ясен
    uint256 public balance;      // number? НЕТ. И вот тут начинается
    mapping(address => uint256) deposits;  // почти Map
}