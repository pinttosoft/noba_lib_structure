import { BankingMongoRepository } from "../../src";

describe("Banking Rails", () => {
  process.env.MONGO_PASS = "zrfhowt0cguf";
  process.env.MONGO_USER = "noab-dev-mongodb";
  process.env.MONGO_DB = "dbnobadev";
  process.env.MONGO_SERVER = "cluster0.xdwtnb4.mongodb.net";
  it("rails update property", async () => {
    const repo = BankingMongoRepository.instance();

    const rails = await repo.findAllBankingRails();
    console.log("rails", rails);
  });
});
