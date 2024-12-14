# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
# 启动本地节点
npx hardhat node
# 部署
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```
## gui界面

https://app.tryethernal.com/overview

安装

```bash
pnpm install --save-dev hardhat-ethernal
```

添加配置:hardhat.config.js 中添加

```bash
require('hardhat-ethernal');
```

在 [https://app.tryethernal.com](https://app.tryethernal.com/) 注册账号,获取 API token

初始化浏览器