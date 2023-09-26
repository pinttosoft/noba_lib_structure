import { ExchangeMongoRepository } from "../../src";

describe("Swap", () => {
  it("should return all exchanges by client id", async () => {
    const clientId = "FSilva187263254";
    const page = 1;
    const perPage = 10;

    const findExchangesByClientId =
      await ExchangeMongoRepository.instance().getExchangesByClientId(
        clientId,
        page,
        perPage,
      );
    console.log(findExchangesByClientId);
  });
});
