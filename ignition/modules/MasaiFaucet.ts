import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MasaiTokenFaucetModule = buildModule("MasaiTokenFaucetModule", (m) => {
  const masaiTokenFaucet = m.contract("MasaiTokenFaucet");

  return { masaiTokenFaucet };
});

export default MasaiTokenFaucetModule;
