// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YDCoin is ERC20, Ownable {
    // 事件
    event TokensBurned(address indexed burner, uint256 amount);
    event TokensMinted(address indexed to, uint256 amount);

    // 状态变量
    uint256 public constant INITIAL_SUPPLY = 1_000_000; // 初始供应量
    uint256 public constant MAX_SUPPLY = 10_000_000;    // 最大供应量
    mapping(address => bool) public blacklist;          // 黑名单

    constructor() ERC20("YD Coin", "YD") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY * 10 ** decimals());
    }

    // 铸造新代币
    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY * 10 ** decimals(), "Exceeds max supply");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    // 销毁代币
    function burn(uint256 amount) public {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    // 将地址加入黑名单
    function addToBlacklist(address account) public onlyOwner {
        blacklist[account] = true;
    }

    // 将地址从黑名单中移除
    function removeFromBlacklist(address account) public onlyOwner {
        blacklist[account] = false;
    }

    // 重写转账检查
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        require(!blacklist[from] && !blacklist[to], "Address blacklisted");
        super._update(from, to, amount);
    }
}