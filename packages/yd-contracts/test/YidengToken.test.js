const YidengToken = artifacts.require("YidengToken");

contract("YidengToken", (accounts) => {
  const [owner, account1, account2] = accounts;

  let tokenInstance;

  before(async () => {
    // 部署合约实例
    tokenInstance = await YidengToken.deployed();
  });

  it("应该正确初始化代币名称和符号", async () => {
    const name = await tokenInstance.name();
    const symbol = await tokenInstance.symbol();
    assert.equal(name, "YidengToken", "代币名称不正确");
    assert.equal(symbol, "YDT", "代币符号不正确");
  });

  it("应该将初始供应量分配给部署者账户", async () => {
    const ownerBalance = await tokenInstance.balanceOf(owner);
    const totalSupply = await tokenInstance.totalSupply();
    assert.equal(
      ownerBalance.toString(),
      totalSupply.toString(),
      "初始供应量未分配给部署者"
    );
  });

  it("应该允许账户之间转账", async () => {
    const transferAmount = web3.utils.toWei("50", "ether");

    // 转账给 account1
    await tokenInstance.transfer(account1, transferAmount, { from: owner });

    const account1Balance = await tokenInstance.balanceOf(account1);
    assert.equal(
      account1Balance.toString(),
      transferAmount,
      "转账后余额不正确"
    );
  });

  it("应该拒绝超出余额的转账", async () => {
    const largeAmount = web3.utils.toWei("1000000", "ether");

    try {
      await tokenInstance.transfer(account2, largeAmount, { from: account1 });
      assert.fail("应该抛出错误但没有抛出");
    } catch (error) {
      assert(error.message.includes("revert"), "错误信息不包含 revert");
    }
  });

  it("应该允许查询总供应量", async () => {
    const totalSupply = await tokenInstance.totalSupply();
    const ownerBalance = await tokenInstance.balanceOf(owner);
    const account1Balance = await tokenInstance.balanceOf(account1);

    const sumBalances = BigInt(ownerBalance) + BigInt(account1Balance);
    assert.equal(
      sumBalances.toString(),
      totalSupply.toString(),
      "总供应量与所有账户余额之和不匹配"
    );
  });
});
