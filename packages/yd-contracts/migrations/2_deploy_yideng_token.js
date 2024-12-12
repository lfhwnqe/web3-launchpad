const YidengToken = artifacts.require("YidengToken");

module.exports = function (deployer) {
  const name = "YidengToken"; // 代币名称
  const symbol = "YDT"; // 代币符号
  const initialOwner = "0x10E7480Ea1c1f6643F4161222E12ACA18fb9CD06"; // 部署合约时的初始所有者地址

  deployer.deploy(YidengToken, name, symbol, initialOwner);
};
