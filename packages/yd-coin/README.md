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
```shell
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```

# 部署ydtoken
```shell
npx hardhat run scripts/initializeToken.ts --network localhost
```