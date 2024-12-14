import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const YiDengTokenModule = buildModule("YiDengTokenModule", (m) => {
    // 只部署合约，不添加额外选项
    const token = m.contract("YiDengToken", []);
    
    return { token };
});

export default YiDengTokenModule; 