import { AccountMongoRepository } from "../../src/account/infrastructure/mongo/account_mongo_repository";

describe("Account", () => {
  it("FindBy AccountId", async () => {
    const account =
      await AccountMongoRepository.instance().findByAccountId("DANIELLEE002");
  });
});
