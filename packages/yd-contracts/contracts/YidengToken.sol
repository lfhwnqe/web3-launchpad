// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YidengToken is ERC20, Ownable {
    // 初始代币总量
    uint256 public constant INITIAL_SUPPLY = 1000000 * (10 ** 18); // 100 万代币，假设有 18 位小数

    constructor(
        string memory name,
        string memory symbol,
        address initialOwner
    ) ERC20(name, symbol) Ownable(initialOwner) {
        // 可选：初始化代币总量
        _mint(initialOwner, 1000000 * 10 ** decimals());
    }

    // 铸造新代币
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    // 销毁代币
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
