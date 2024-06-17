import {
  Counterparty,
  CounterpartyMongoRepository,
  CounterpartyType,
  Criteria,
  Filters,
  Operator,
  Order,
  OrderTypes,
} from "../../src";

describe("Counterparty", () => {
  it("should list used criteria method page null", async () => {
    const clientId = "FSilva187263254";

    const filterClientId: Map<string, string> = new Map([
      ["field", "clientId"],
      ["operator", Operator.EQUAL],
      ["value", clientId],
    ]);

    const filterCounterpartyType: Map<string, string> = new Map([
      ["field", "counterpartyType"],
      ["operator", Operator.EQUAL],
      ["value", CounterpartyType.FIAT],
    ]);

    const criteria = new Criteria(
      Filters.fromValues([filterClientId, filterCounterpartyType]),
      Order.fromValues("createdAt", OrderTypes.DESC),
      20,
      1,
    );

    const result = await CounterpartyMongoRepository.instance().list(criteria);
    // console.log(result);
    expect(result.nextPag).toBeNull();
  });
  it("should list used criteria method page not null", async () => {
    const clientId = "FSilva187263254";

    const filterClientId: Map<string, string> = new Map([
      ["field", "clientId"],
      ["operator", Operator.EQUAL],
      ["value", clientId],
    ]);

    const filterCounterpartyType: Map<string, string> = new Map([
      ["field", "counterpartyType"],
      ["operator", Operator.EQUAL],
      ["value", CounterpartyType.FIAT],
    ]);

    const criteria = new Criteria(
      Filters.fromValues([filterClientId, filterCounterpartyType]),
      Order.fromValues("createdAt", OrderTypes.DESC),
      5,
      1,
    );

    const result = await CounterpartyMongoRepository.instance().list(criteria);
    //console.log(result);
    expect(result.nextPag).toEqual(result.nextPag);
  });

  it("should get counterparty by clientId, assetId, counterPartyId", async () => {
    const counterPartyId = "WValencia-Moreno1128024080";
    const assetId = "FIAT_TESTNET_USD";
    const clientId = "MSerrano181263254";
    const isInternal = "S";

    const counterparty: Counterparty =
      await CounterpartyMongoRepository.instance().findByClientIdAndCounterPartyIdAndAssetId(
        counterPartyId,
        assetId,
        clientId,
        isInternal,
      );

    expect(counterparty).toBeDefined();

    //   const withdrawalRequest =
    //     await WithdrawalRequestMongoRepository.instance().findByWithdrawalId(
    //       "b50ad676-79e0-41ad-a908-8744868deca0",
    //     );
    //
    //   console.log(withdrawalRequest.getCounterparty());
    //   console.log(withdrawalRequest.getCounterparty().toPrimitives());
    //
    //   expect(withdrawalRequest.getCounterparty()).toBeDefined();
  });
});
