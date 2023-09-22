import { ExchangeMongoRepository } from "../../src";

describe("Exchanges", () => {
  it("should return an array of exchanges for a given client ID", async () => {
    const clientId = "FSilva187263254";
    const exchangeMongoRepository = new ExchangeMongoRepository();
    const exchanges = await exchangeMongoRepository.getExchangesByClientId(
      clientId,
      1,
      10,
    );

    expect(Array.isArray(exchanges.results)).toBe(true);
    expect(exchanges.results.length).toBeGreaterThan(0);
    expect(exchanges.results[0]).toHaveProperty("clientId", clientId);
  });
});
