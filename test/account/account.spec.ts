import { AccountMongoRepository } from "../../src/account/infrastructure/mongo/account_mongo_repository";

describe("Account", () => {
  it("FindBy AccountId", async () => {
    const account =
      await AccountMongoRepository.instance().findByAccountId("DANIELLEE002");
  });

  it("FindBy Application id", async () => {
    const account =
      await AccountMongoRepository.instance().findAccountByApplicationId(
        "fc5da13b-3a52-41b9-acff-b1f236c59fe3",
      );

    console.log("account", account.getApplicationId());
    console.log("account", account);
  });
});
