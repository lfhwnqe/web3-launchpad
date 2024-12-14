import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("CourseMarket", function () {
    let YiDengToken: any;
    let CourseMarket: any;
    let token: Contract;
    let market: Contract;
    let owner: SignerWithAddress;
    let creator: SignerWithAddress;
    let buyer: SignerWithAddress;

    beforeEach(async function () {
        [owner, creator, buyer] = await ethers.getSigners();
        
        // 部署代币合约
        YiDengToken = await ethers.getContractFactory("YiDengToken");
        token = await YiDengToken.deploy();
        await token.waitForDeployment();

        // 部署市场合约
        CourseMarket = await ethers.getContractFactory("CourseMarket");
        market = await CourseMarket.deploy(await token.getAddress());
        await market.waitForDeployment();

        // 初始化代币分配
        await token.distributeInitialTokens(owner.address, owner.address, owner.address);
        
        // 转一些代币给买家用于测试
        await token.transfer(buyer.address, 10000);
    });

    describe("课程管理", function () {
        it("应该能添加新课程", async function () {
            await market.addCourse("COURSE-001", "区块链基础", 100);
            
            const course = await market.courses(1);
            expect(course.web2CourseId).to.equal("COURSE-001");
            expect(course.name).to.equal("区块链基础");
            expect(course.price).to.equal(100);
            expect(course.isActive).to.be.true;
            expect(course.creator).to.equal(owner.address);
        });

        it("不能添加重复的web2CourseId", async function () {
            await market.addCourse("COURSE-001", "课程1", 100);
            await expect(
                market.addCourse("COURSE-001", "课程2", 200)
            ).to.be.revertedWith("Course already exists");
        });

        it("web2CourseId不能为空", async function () {
            await expect(
                market.addCourse("", "课程名称", 100)
            ).to.be.revertedWith("Web2 course ID cannot be empty");
        });

        it("只有所有者能添加课程", async function () {
            await expect(
                market.connect(buyer).addCourse("COURSE-001", "课程1", 100)
            ).to.be.revertedWithCustomError(market, "OwnableUnauthorizedAccount")
            .withArgs(buyer.address);
        });
    });

    describe("课程购买", function () {
        beforeEach(async function () {
            // 添加测试课程
            await market.addCourse("COURSE-001", "测试课程", 100);
            // 批准市场合约使用代币
            await token.connect(buyer).approve(market.getAddress(), 1000);
        });

        it("应该能购买课程", async function () {
            await market.connect(buyer).purchaseCourse("COURSE-001");
            expect(await market.hasCourse(buyer.address, "COURSE-001")).to.be.true;
        });

        it("购买后应该正确转移代币", async function () {
            const course = await market.courses(1);
            const creatorInitialBalance = await token.balanceOf(course.creator);
            
            await market.connect(buyer).purchaseCourse("COURSE-001");
            
            const creatorFinalBalance = await token.balanceOf(course.creator);
            expect(creatorFinalBalance - creatorInitialBalance).to.equal(100);
        });

        it("不能购买不存在的课程", async function () {
            await expect(
                market.connect(buyer).purchaseCourse("NONEXISTENT")
            ).to.be.revertedWith("Course does not exist");
        });

        it("不能重复购买同一课程", async function () {
            await market.connect(buyer).purchaseCourse("COURSE-001");
            await expect(
                market.connect(buyer).purchaseCourse("COURSE-001")
            ).to.be.revertedWith("Already purchased");
        });

        it("没有足够代币不能购买", async function () {
            // 先消耗掉买家的代币
            await token.connect(buyer).transfer(owner.address, 10000);
            
            await expect(
                market.connect(buyer).purchaseCourse("COURSE-001")
            ).to.be.revertedWithCustomError(token, "ERC20InsufficientBalance")
            .withArgs(buyer.address, 0, 100);
        });
    });

    describe("课程查询", function () {
        beforeEach(async function () {
            await market.addCourse("COURSE-001", "测试课程", 100);
        });

        it("应该能查询用户是否拥有课程", async function () {
            expect(await market.hasCourse(buyer.address, "COURSE-001")).to.be.false;
            
            await token.connect(buyer).approve(market.getAddress(), 100);
            await market.connect(buyer).purchaseCourse("COURSE-001");
            
            expect(await market.hasCourse(buyer.address, "COURSE-001")).to.be.true;
        });

        it("查询不存在的课程应该失败", async function () {
            await expect(
                market.hasCourse(buyer.address, "NONEXISTENT")
            ).to.be.revertedWith("Course does not exist");
        });
    });
}); 