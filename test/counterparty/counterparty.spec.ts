import {
  AssetMongoRepository,
  ClientMongoRepository,
  CounterpartyFactoryDTO,
  CounterpartyMongoRepository,
  CounterpartyType,
  Criteria,
  Filters,
  Operator,
  Order,
  OrderTypes,
  OriginWallet,
  RegisterOrSearchCounterpartyInternal,
  RelationshipConsumer,
  WalletMongoRepository,
} from "../../src";
import * as console from "console";

describe("Counterparty", () => {
  it("should be create new instance to counterparty", async () => {
    const client =
      await ClientMongoRepository.instance().findByClientId("FSilva187263254");

    const counterpartyDTO = {
      type: CounterpartyType.CRYPTO,
      client: client,
      informationWallet: {
        assetId: "BITCOIN_TESTNET_BTC",
        address: "mv4rnyY3Su5gjcDNzbMLKBQkBicCtHUtFB",
        relationshipConsumer: RelationshipConsumer.CHILDREN,
        originWallet: OriginWallet.OTHER,
      },
      informationOwner: {
        name: "Jose",
        address: { country: "BR" },
      },
    } as unknown as CounterpartyFactoryDTO;

    // const counterparty: Counterparty =
    //   CounterpartyFactory.createNewCounterparty(counterpartyDTO);
  });

  it("should list used criteria method", async () => {
    const clientId = "FSilva187263254";

    const filterClientId: Map<string, string> = new Map([
      ["field", "clientId"],
      ["operator", Operator.EQUAL],
      ["value", clientId],
    ]);

    const filterCounterpartyType: Map<string, string> = new Map([
      ["field", "counterpartyType"],
      ["operator", Operator.EQUAL],
      ["value", CounterpartyType.CRYPTO],
    ]);

    const criteria = new Criteria(
      Filters.fromValues([filterClientId, filterCounterpartyType]),
      Order.fromValues("createdAt", OrderTypes.DESC),
      20,
      1,
    );

    const result = await CounterpartyMongoRepository.instance().list(criteria);
    console.log(result);
  });

  it("should register or search counterparty internal", async () => {
    const clientOrigin =
      await ClientMongoRepository.instance().findByClientId("FSilva187263254");

    const clientDestination =
      await ClientMongoRepository.instance().findByClientId(
        "ABejarano187263254",
      );

    const asset = await AssetMongoRepository.instance().findAssetByCode("USD");

    const counterparty = await new RegisterOrSearchCounterpartyInternal(
      WalletMongoRepository.instance(),
      CounterpartyMongoRepository.instance(),
    ).run(clientOrigin, clientDestination, asset);
    console.log(counterparty);
    expect(counterparty.getCounterpartyId()).toBe("ABejarano187263254");
  });

  it("should register and remove accents", async () => {
    const clientOrigin =
      await ClientMongoRepository.instance().findByClientId("FSilva187263254");

    const clientDestination =
      await ClientMongoRepository.instance().findByClientId(
        "MSerrano181263254",
      );

    const asset = await AssetMongoRepository.instance().findAssetByCode("USD");

    const counterparty = await new RegisterOrSearchCounterpartyInternal(
      WalletMongoRepository.instance(),
      CounterpartyMongoRepository.instance(),
    ).run(clientOrigin, clientDestination, asset);
    expect(counterparty.getCounterpartyId()).toBe("MSerrano181263254");
  });
});
