import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("YiDengERC721Coin", function () {
  let nft: Contract;
  let owner: SignerWithAddress;
  let recipient: SignerWithAddress;

  beforeEach(async function () {
    [owner, recipient] = await ethers.getSigners();
    const NFT = await ethers.getContractFactory("YiDengERC721Coin");
    nft = await NFT.deploy("YiDeng NFT", "YDNFT");
    await nft.waitForDeployment();
  });

  it("should mint a new NFT", async function () {
    const tokenURI = "https://example.com/token.json";
    const tx = await nft.safeMint(recipient.address, tokenURI);
    const receipt = await tx.wait();
    
    // 从事件中获取 tokenId
    const event = receipt.logs[0];
    const tokenId = event.args[2]; // Transfer event: from, to, tokenId

    expect(await nft.ownerOf(tokenId)).to.equal(recipient.address);
    expect(await nft.tokenURI(tokenId)).to.equal(tokenURI);
  });
});
