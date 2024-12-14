import { ethers } from "hardhat";

async function main() {
    const [owner] = await ethers.getSigners();
    
    // 部署新合约而不是尝试连接现有合约
    const YiDengToken = await ethers.getContractFactory("YiDengToken");
    const token = await YiDengToken.deploy();
    await token.waitForDeployment();

    const tokenAddress = await token.getAddress();
    console.log("代币合约部署地址:", tokenAddress);

    console.log("开始初始化代币分配...");

    // 调用 distributeInitialTokens 函数进行初始分配
    const tx = await token.distributeInitialTokens(
        owner.address,  // 团队钱包
        owner.address,  // 市场营销钱包
        owner.address   // 社区钱包
    );
    await tx.wait();

    console.log("代币初始化完成");

    // 查看总供应量
    const totalSupply = await token.totalSupply();
    console.log("当前总供应量:", totalSupply.toString());

    // 查看所有者余额
    const balance = await token.balanceOf(owner.address);
    console.log("所有者余额:", balance.toString());
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
}); 