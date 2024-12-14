// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const YDCoinModule = buildModule("YDCoinModule", (m) => {
  const ydCoin = m.contract("YDCoin", []);

  return { ydCoin };
});

export default YDCoinModule;
