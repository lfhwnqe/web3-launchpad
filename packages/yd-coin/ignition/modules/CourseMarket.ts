import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CourseMarketModule = buildModule("CourseMarketModule", (m) => {
    // 首先部署代币合约
    const token = m.contract("YiDengToken", []);
    
    // 然后部署市场合约，并传入代币合约地址
    const market = m.contract("CourseMarket", [token]);

    return { token, market };
});

export default CourseMarketModule; 