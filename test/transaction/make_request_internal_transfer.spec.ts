import {
  AssetMongoRepository,
  ClientMongoRepository,
  CounterpartyMongoRepository,
  MakeRequestInternalTransfer,
  TransactionMongoRepository,
  WalletMongoRepository,
  WalletProvider,
  WithdrawalRequestMongoRepository,
  WithdrawalStatus,
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
      WalletProvider.LAYER2,
    );
  });

  describe("Mark transaction as processed", () => {
    it("should ", async () => {
      const transaction =
        await TransactionMongoRepository.instance().findExchangeTransactionByExchangeIdAndStatus(
          "f0a1285f-2bdc-4279-b753-a1222900c619",
          WithdrawalStatus.IN_PROCESS,
        );
      transaction.markAsCompleted();

      await TransactionMongoRepository.instance().saveExchangeTransaction(
        transaction,
      );

      console.log(transaction);
    });

    it("should search transaction", async () => {
      const clientId = "";
      const transaction =
        await TransactionMongoRepository.instance().findTransactionByAssetIdAmountStatusClientId(
          "FIAT_TESTNET_PAB",
          -7,
          WithdrawalStatus.IN_PROCESS,
          clientId,
        );
      //transaction.markAsCompleted();

      //console.log("transaction", transaction);
      console.log("transaction", transaction.getTransactionId());
      expect(transaction.getTransactionId()).not.toBe(null);
    });
  });

  it("should create wallet for receiver and create make request internal transfer of the USD", async () => {
    const payload = {
      amount: 123,
      clientIdOrign: "MSerrano181263254",
      clientIdDestination: "PPitamawi45677654",
      reference: "Teste",
    };

    const withdrawId = await new MakeRequestInternalTransfer(
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
      WalletProvider.LAYER2,
    );

    console.log("withdrawId", withdrawId);
    expect(withdrawId).not.toBe(undefined);
  });
});
