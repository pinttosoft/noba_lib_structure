import {
  AmountValueObject,
  AssetMongoRepository,
  ClientMongoRepository,
  CounterpartyMongoRepository,
  WithdrawalPurpose,
  WithdrawalRequest,
  WithdrawalRequestMongoRepository,
  WithdrawalType,
} from "../../src";

describe("Withdrawals", () => {
  it("Create withdrawal request for ACH PAB internal", async () => {
    const clientId = "MSerrano181263254";
    const clientDestinationId = "FSilva187263254";
    const clientOrigin =
      await ClientMongoRepository.instance().findByClientId(clientId);

    const clientDestination =
      await ClientMongoRepository.instance().findByClientId(
        clientDestinationId,
      );
    const amount = 123;
    const reference = "first withdrawal request test";
    const asset = await AssetMongoRepository.instance().findAssetByCode("PAB");

    const counterparty =
      await CounterpartyMongoRepository.instance().findMyCounterpartyByAssetId(
        clientOrigin.getClientId(),
        clientDestination.getClientId(),
        asset.getAssetId(),
      );

    const withdrawalRequest: WithdrawalRequest =
      WithdrawalRequest.createNewWithdrawalRequest(
        clientOrigin,
        counterparty,
        AmountValueObject.create(amount),
        reference,
        WithdrawalType.INTERNAL,
        WithdrawalPurpose.LOAN,
      );

    // console.log("withdrawalRequest", withdrawalRequest);
    await WithdrawalRequestMongoRepository.instance().upsert(withdrawalRequest);
  });

  it("Create withdrawal request for ACH PAB external", async () => {
    //
  });
});
