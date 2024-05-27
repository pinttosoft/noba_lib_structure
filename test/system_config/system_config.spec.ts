import { SystemConfigurationMongoRepository } from "../../src";

describe("System config", () => {
  it("feeswap", async () => {
    const feeSwap =
      await SystemConfigurationMongoRepository.instance().getDefaultFeeSwap();

    console.log("feeSwap", feeSwap);
  });

  it("feeWire", async () => {
    const feeWire =
      await SystemConfigurationMongoRepository.instance().getDefaultFeeWire();

    console.log("feeWire", feeWire);
  });

  it("Should get old fees for ACH Panama", async () => {
    const feeACHPAB =
      await SystemConfigurationMongoRepository.instance().getDefaultFeeACHPAB();

    //console.log("feeACHPAB", feeACHPAB.out);
    //console.log("feeACHPAB", feeACHPAB.getFeeOut());
  });

  it("Should get new fees for ACH Panama", async () => {
    const feeACHPAB =
      await SystemConfigurationMongoRepository.instance().getDefaultFeeACHPAB();

    console.log("feeACHPAB", feeACHPAB.getFeeDomestic());
    console.log("feeACHPAB", feeACHPAB.getFeeInternational());
  });

  it("Should get new fees for ACH Usd", async () => {
    const feeAchUsd =
      await SystemConfigurationMongoRepository.instance().getDefaultFeeAchUsd();

    console.log("feeAchUsd", feeAchUsd);
    console.log("feeAchUsd", feeAchUsd.getIn());
    console.log("feeAchUsd", feeAchUsd.getOut());
  });
});
