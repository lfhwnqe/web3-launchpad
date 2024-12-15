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
    
    // 2. 部署 NFT 合约
    console.log("\n开始部署 NFT 合约...");
    const YiDengERC721Coin = await ethers.getContractFactory("YiDengERC721Coin");
    const nft = await YiDengERC721Coin.deploy("YiDeng NFT", "YDNFT");
    await nft.waitForDeployment();
    const nftAddress = await nft.getAddress();
    console.log("NFT 合约部署完成，地址:", nftAddress);

    // 3. 部署课程市场
    console.log("\n开始部署课程市场...");
    const CourseMarket = await ethers.getContractFactory("CourseMarket");
    const market = await CourseMarket.deploy(tokenAddress);
    await market.waitForDeployment();
    const marketAddress = await market.getAddress();

    // 同步到 Ethernal
    await hre.ethernal.push({
        name: 'YiDengToken',
        address: tokenAddress
    });
    await hre.ethernal.push({
        name: 'YiDengERC721Coin',
        address: nftAddress
    });
    await hre.ethernal.push({
        name: 'CourseMarket',
        address: marketAddress
    });

    // 4. 初始化代币分配
    console.log("\n开始初始化代币分配...");
    const tx = await token.distributeInitialTokens(
        deployer.address,
        deployer.address,
        deployer.address
    );
    await tx.wait();

    // 5. 添加示例课程
    console.log("\n添加示例课程...");
    try {
        const addTx1 = await market.addCourse("COURSE-001", "区块链基础", 100);
        await addTx1.wait();
        console.log("课程1添加成功");

        const addTx2 = await market.addCourse("COURSE-002", "智能合约开发", 200);
        await addTx2.wait();
        console.log("课程2添加成功");

        // 验证课程数量
        const courseCount = await market.courseCount();
        console.log("当前课程总数:", courseCount.toString());
    } catch (error) {
        console.error("添加课程失败:", error);
    }

    // 6. 打印部署信息
    console.log("\n部署信息汇总:");
    console.log("-------------------");
    console.log("代币合约地址:", tokenAddress);
    console.log("NFT合约地址:", nftAddress);
    console.log("课程市场地址:", marketAddress);
    console.log("部署者地址:", deployer.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 