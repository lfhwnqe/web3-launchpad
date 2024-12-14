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
# 测试
```shell
# 测试ydtoken
npx hardhat test test/YiDengToken.test.ts
# 测试课程市场
npx hardhat test test/CourseMarket.test.ts
```
# 部署ydtoken
```shell
# 部署ydtoken
npx hardhat run scripts/initializeToken.ts --network localhost
# 部署课程市场
npx hardhat run scripts/deployCourseMarket.ts --network localhost
```