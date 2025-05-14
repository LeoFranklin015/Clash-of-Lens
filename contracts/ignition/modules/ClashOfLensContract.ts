import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ClashOfLensContractModule = buildModule(
  "ClashOfLensContractModule",
  (m) => {
    const clashOfLens = m.contract("ClashOfLensContract");
    return { clashOfLens };
  }
);

export default ClashOfLensContractModule;
