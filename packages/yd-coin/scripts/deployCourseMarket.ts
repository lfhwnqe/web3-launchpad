import { ethers } from "hardhat";
import hre from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("使用账户地址部署:", deployer.address);

    // 1. 部署 YiDengToken
    console.log("开始部署 YiDengToken...");
    const YiDengToken = await ethers.getContractFactory("YiDengToken");
    const token = await YiDengToken.deploy();
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    
    // 同步到 Ethernal
    await hre.ethernal.push({
        name: 'YiDengToken',
        address: tokenAddress
    });
    
    console.log("YiDengToken 部署完成，地址:", tokenAddress);

    // 2. 部署课程市场
    console.log("\n开始部署课程市场...");
    const CourseMarket = await ethers.getContractFactory("CourseMarket");
    const market = await CourseMarket.deploy(tokenAddress);
    await market.waitForDeployment();
    const marketAddress = await market.getAddress();
    
    // 同步到 Ethernal
    await hre.ethernal.push({
        name: 'CourseMarket',
        address: marketAddress
    });
    
    console.log("课程市场部署完成，地址:", marketAddress);

    // 3. 初始化代币分配
    console.log("\n开始初始化代币分配...");
    const tx = await token.distributeInitialTokens(
        deployer.address,  // 团队钱包
        deployer.address,  // 市场营销钱包
        deployer.address   // 社区钱包
    );
    await tx.wait();
    console.log("代币初始化完成");

    // 4. 添加示例课程
    console.log("\n添加示例课程...");
    await market.addCourse("COURSE-001", "区块链基础", 100);
    await market.addCourse("COURSE-002", "智能合约开发", 200);
    console.log("示例课程添加完成");

    // 5. 打印部署信息
    console.log("\n部署信息汇总:");
    console.log("-------------------");
    console.log("代币合约地址:", tokenAddress);
    console.log("课程市场地址:", marketAddress);
    console.log("部署者地址:", deployer.address);
    
    // 6. 验证合约部署
    console.log("\n验证合约部署...");
    const tokenSupply = await token.totalSupply();
    const courseCount = await market.courseCount();
    console.log("代币总供应量:", tokenSupply.toString());
    console.log("课程总数:", courseCount.toString());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 