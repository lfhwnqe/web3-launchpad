import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("YDCoin", function () {
    let YDCoin: any;
    let ydCoin: Contract;
    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        YDCoin = await ethers.getContractFactory("YDCoin");
        ydCoin = await YDCoin.deploy();
        await ydCoin.waitForDeployment();
    });

    describe("部署", function () {
        it("应该设置正确的名称和符号", async function () {
            expect(await ydCoin.name()).to.equal("YD Coin");
            expect(await ydCoin.symbol()).to.equal("YD");
        });

        it("应该将所有代币铸造给部署者", async function () {
            const totalSupply = await ydCoin.totalSupply();
            const ownerBalance = await ydCoin.balanceOf(owner.address);
            expect(ownerBalance).to.equal(totalSupply);
        });
    });

    describe("交易", function () {
        it("应该能够转账代币", async function () {
            await ydCoin.transfer(addr1.address, 50);
            expect(await ydCoin.balanceOf(addr1.address)).to.equal(50);
        });

        it("应该能够批准和通过授权转账", async function () {
            await ydCoin.approve(addr1.address, 100);
            await ydCoin.connect(addr1).transferFrom(owner.address, addr2.address, 50);
            expect(await ydCoin.balanceOf(addr2.address)).to.equal(50);
        });
    });

    describe("铸造和销毁", function () {
        it("所有者应该能够铸造新代币", async function () {
            await ydCoin.mint(addr1.address, 100);
            expect(await ydCoin.balanceOf(addr1.address)).to.equal(100);
        });

        it("用户应该能够销毁自己的代币", async function () {
            await ydCoin.transfer(addr1.address, 100);
            await ydCoin.connect(addr1).burn(50);
            expect(await ydCoin.balanceOf(addr1.address)).to.equal(50);
        });
    });
});