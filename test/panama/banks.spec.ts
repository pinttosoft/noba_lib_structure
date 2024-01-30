import { PanamaMongoRepository } from "../../src/banking/infrastructure/mongo/panama_mongo_repository";

describe("Panama banks", () => {
  it("Should list all panama ach banks", async () => {
    const res = await PanamaMongoRepository.instance().fetchPanamaBanks();

    console.log(res);
  });
});
