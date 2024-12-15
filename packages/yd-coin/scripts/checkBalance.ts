import { ethers } from "hardhat";

async function main() {
    const YiDengToken = await ethers.getContractFactory("YiDengToken");
    const token = await YiDengToken.attach("你的合约地址");

    const totalSupply = await token.totalSupply();
    console.log("Total Supply:", totalSupply.toString());

    const [owner] = await ethers.getSigners();
    const balance = await token.balanceOf(owner.address);
    console.log("Owner Balance:", balance.toString());
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
}); 