import {
  AssetMongoRepository,
  ClientMongoRepository,
  CounterpartyMongoRepository,
  MakeRequestInternalTransfer,
  WalletMongoRepository,
  WithdrawalRequestMongoRepository,
} from "../../src";

describe("Make request internal transfer", () => {
  it("should create make request internal transfer of the USD", async () => {
    const payload = {
      amount: 100,
      clientIdOrign: "FSilva187263254",
      clientIdDestination: "DANIELLEE002",
      reference: "Teste",
    };

    const transfer = await new MakeRequestInternalTransfer(
      ClientMongoRepository.instance(),
      WalletMongoRepository.instance(),
      AssetMongoRepository.instance(),
      WithdrawalRequestMongoRepository.instance(),
      CounterpartyMongoRepository.instance(),
    ).run(
      payload.clientIdOrign,
      payload.clientIdDestination,
      payload.amount,
      "USD",
      payload.reference,
    );
  });
});
