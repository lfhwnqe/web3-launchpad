import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    const marketAddress = "0x68B1D87F95878fE05B998F19b66F4baba5De1aed"; // 使用新部署的地址

    const CourseMarket = await ethers.getContractFactory("CourseMarket");
    const market = CourseMarket.attach(marketAddress);

    console.log("添加课程...");
    
    const courses = [
        { id: "COURSE-001", name: "区块链基础", price: 100 },
        { id: "COURSE-002", name: "智能合约开发", price: 200 },
        // 添加更多课程...
    ];

    for (const course of courses) {
        await market.addCourse(course.id, course.name, course.price);
        console.log(`添加课程: ${course.name}`);
    }

    console.log("课程添加完成");

    // 验证
    const courseCount = await market.courseCount();
    console.log("当前课程总数:", courseCount.toString());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 