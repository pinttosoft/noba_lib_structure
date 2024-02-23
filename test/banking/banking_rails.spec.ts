import { BankingMongoRepository, BankingRails } from "../../src";

describe("Banking rails", () => {
  it("Get all rails", async () => {
    const rails = await BankingMongoRepository.instance().fetchAll();

    console.log("rails", rails);
  });

  it("Delete onix rail", async () => {
    const railsRepo = BankingMongoRepository.instance();

    const onixRailPayload = new BankingRails().fromPrimitives({
      countryCode: "Onix",
      countryName: "Onix Coin",
      assetCountry: "onx",
      rails: {},
      provider: "Pinttosoft",
    });

    // await railsRepo.upsert(onixRailPayload);
    const onixRes = await railsRepo.findBankingRailByCountryCode("Onix");
    await railsRepo.deleteRail(onixRes);
  });

  it("Edit onix coin rail", async () => {
    const railsRepo = BankingMongoRepository.instance();
    const onixRes = await railsRepo.findBankingRailByCountryCode("Onix");

    onixRes.setCountryCode("edited onix code");
    onixRes.setCountryName("editex onix name");
    await railsRepo.editRail(onixRes);
  });
});
