import { SystemConfigurationMongoRepository } from "../../src";

describe("System config", () => {
  it("feeWire", async () => {
    const feeWire =
      await SystemConfigurationMongoRepository.instance().getDefaultFeeWire();
    console.log(feeWire);
  });
});
