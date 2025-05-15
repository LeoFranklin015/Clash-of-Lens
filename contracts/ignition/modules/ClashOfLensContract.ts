import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ClashOfLensContractModule = buildModule(
  "ClashOfLensContractModule",
  (m) => {
    const deployer = m.getAccount(0);
    const clashOfLens = m.contract("ClashOfLensContract", [deployer]);
    return { clashOfLens };
  }
);

export default ClashOfLensContractModule;
