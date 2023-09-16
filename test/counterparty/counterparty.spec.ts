import {
  ClientMongoRepository,
  Counterparty,
  CounterpartyFactoryDTO,
  CounterpartyMongoRepository,
  CounterpartyType,
  Criteria,
  Filters,
  Operator,
  Order,
  OrderTypes,
  OriginWallet,
  RelationshipConsumer,
  WalletInformationDTO,
} from "../../src";
import { CounterpartyFactory } from "../../src/counterparty/domain/factories/counterparty.factory";
import * as console from "console";

describe("Counterparty", () => {
  it("should be create new instance to counterparty", async () => {
    const client =
      await ClientMongoRepository.instance().findByClientId("FSilva187263254");

    console.log(client);

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

    const counterparty: Counterparty =
      CounterpartyFactory.createNewCounterparty(counterpartyDTO);
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
});
