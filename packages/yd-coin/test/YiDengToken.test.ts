import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("YiDengToken", function () {
    let YiDengToken: any;
    let token: Contract;
    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        YiDengToken = await ethers.getContractFactory("YiDengToken");
        token = await YiDengToken.deploy();
        await token.waitForDeployment();
    });

    describe("基本信息", function () {
        it("应该有正确的名称和符号", async function () {
            expect(await token.name()).to.equal("YiDeng Token");
            expect(await token.symbol()).to.equal("YD");
        });

        it("应该有正确的代币兑换比率", async function () {
            expect(await token.TOKENS_PER_ETH()).to.equal(1000);
        });

        it("应该有正确的最大供应量", async function () {
            expect(await token.MAX_SUPPLY()).to.equal(1250000);
        });
    });

    describe("初始代币分配", function () {
        it("应该正确分配初始代币", async function () {
            await token.distributeInitialTokens(
                owner.address,
                addr1.address,
                addr2.address
            );

            // 检查分配结果
            expect(await token.balanceOf(owner.address)).to.equal(250000); // 20%
            expect(await token.balanceOf(addr1.address)).to.equal(125000); // 10%
            expect(await token.balanceOf(addr2.address)).to.equal(125000); // 10%
        });

        it("不能重复进行初始分配", async function () {
            await token.distributeInitialTokens(
                owner.address,
                addr1.address,
                addr2.address
            );

            await expect(
                token.distributeInitialTokens(
                    owner.address,
                    addr1.address,
                    addr2.address
                )
            ).to.be.revertedWith("Initial distribution already done");
        });
    });

    describe("代币购买", function () {
        beforeEach(async function () {
            // 先进行初始分配
            await token.distributeInitialTokens(
                owner.address,
                addr1.address,
                addr2.address
            );
        });

        it("应该能用ETH购买代币", async function () {
            const ethAmount = ethers.parseEther("0.01"); // 更小的购买量
            const expectedTokens = 10; // 0.01 ETH = 10 tokens

            const initialBalance = await token.balanceOf(addr1.address);
            await token.connect(addr1).buyWithETH({ value: ethAmount });
            const finalBalance = await token.balanceOf(addr1.address);
            
            expect(finalBalance - initialBalance).to.equal(expectedTokens);
        });

        it("购买金额不能为0", async function () {
            await expect(
                token.connect(addr1).buyWithETH({ value: 0 })
            ).to.be.revertedWith("Must send ETH");
        });

        it("不能超过最大供应量", async function () {
            const largeAmount = ethers.parseEther("2000"); // 尝试购买超过最大供应量的代币
            await expect(
                token.connect(addr1).buyWithETH({ value: largeAmount })
            ).to.be.revertedWith("Would exceed max supply");
        });
    });

    describe("代币卖出", function () {
        beforeEach(async function () {
            // 先进行初始分配
            await token.distributeInitialTokens(
                owner.address,
                addr1.address,
                addr2.address
            );
            // 再购买一些代币
            await token.connect(addr1).buyWithETH({ 
                value: ethers.parseEther("0.01") 
            });
        });

        it("应该能卖出代币换回ETH", async function () {
            const tokenAmount = 5; // 减少卖出数量
            const initialTokenBalance = await token.balanceOf(addr1.address);

            // 先给合约转一些 ETH 用于卖出测试
            await owner.sendTransaction({
                to: await token.getAddress(),
                value: ethers.parseEther("1")
            });

            // 执行卖出操作
            const tx = await token.connect(addr1).sellTokens(tokenAmount);
            await tx.wait();

            // 获取卖出后的余额
            const finalTokenBalance = await token.balanceOf(addr1.address);

            // 只验证代币余额的变化
            expect(initialTokenBalance - finalTokenBalance).to.equal(tokenAmount);

            // 验证事件被正确触发
            const expectedEthAmount = (BigInt(tokenAmount) * ethers.parseEther("1")) / BigInt(1000);
            await expect(tx)
                .to.emit(token, "TokensSold")
                .withArgs(addr1.address, tokenAmount, expectedEthAmount);
        });

        it("不能卖出超过持有量的代币", async function () {
            const currentBalance = await token.balanceOf(addr1.address);
            const tooManyTokens = currentBalance + BigInt(1); // 尝试卖出超过余额的代币
            
            await expect(
                token.connect(addr1).sellTokens(tooManyTokens)
            ).to.be.revertedWith("Insufficient balance");
        });
    });

    describe("合约所有者功能", function () {
        beforeEach(async function () {
            // 向合约发送一些ETH用于测试
            await addr1.sendTransaction({
                to: await token.getAddress(),
                value: ethers.parseEther("1")
            });
        });

        it("所有者应该能提取合约中的ETH", async function () {
            const initialBalance = await ethers.provider.getBalance(owner.address);
            await token.withdrawETH();
            const finalBalance = await ethers.provider.getBalance(owner.address);
            expect(finalBalance).to.be.gt(initialBalance);
        });

        it("非所有者不能提取ETH", async function () {
            await expect(
                token.connect(addr1).withdrawETH()
            ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount")
            .withArgs(addr1.address);
        });
    });
}); 